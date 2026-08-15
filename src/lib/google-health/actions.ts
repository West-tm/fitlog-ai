"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  upsertCaloriesLogs,
  upsertStepsLogs,
} from "../activity-logs/upsert-activity-logs";
import { getUser } from "../auth/get-user";
import {
  upsertBodyFatLogs,
  upsertWeightLogs,
} from "../body-logs/upsert-body-logs";
import { prisma } from "../prisma/prisma";
import { googleHealthEnv } from "./env";
import { getGoogleHealthAccessToken } from "./google-health";
import {
  googleHealthBodyFatSchema,
  googleHealthCaloriesSchema,
  googleHealthDataSyncFormSchema,
  GoogleHealthDataSyncFormValues,
  googleHealthStepsSchema,
  googleHealthWeightSchema,
} from "./validations";

export async function getGoogleHealthIdentity(accessToken: string) {
  const GOOGLE_HEALTH_REQUEST_TIMEOUT_MS = 10_000;

  const googleHealthIdentitySchema = z.object({
    name: z.string(),
    legacyUserId: z.string().optional(),
    healthUserId: z.string().optional(),
  });

  try {
    const response = await fetch(
      `${googleHealthEnv.apiBaseUrl}/users/me/identity`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(GOOGLE_HEALTH_REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      throw new Error("Google Health identity fetch failed");
    }

    const data = await response.json();
    return googleHealthIdentitySchema.parse(data);
  } catch {
    console.error("Google Health identity fetch failed");
    return null;
  }
}

export async function syncGoogleHealthDataLogs(
  values: GoogleHealthDataSyncFormValues,
) {
  const user = await getUser();

  const connection = await prisma.googleHealthConnection.findUnique({
    where: { userId: user.id },
    select: { id: true, scope: true },
  });

  if (!connection) {
    redirect("/settings/integrations?notice=google-health-not-connected");
  }

  const granted = new Set(connection.scope.split(/\s+/).filter(Boolean));
  const missing = googleHealthEnv.scopes.filter((scope) => !granted.has(scope));

  if (missing.length > 0) {
    return {
      success: false,
      error:
        "Google Health API の権限が不足しています。連携を解除して再度連携してください。",
    };
  }

  const parsedValues = googleHealthDataSyncFormSchema.parse(values);

  const accessToken = await getGoogleHealthAccessToken();

  function getGoogleHealthUrl(
    dataType: "weight" | "body-fat" | "steps" | "total-calories",
  ) {
    return `/users/me/dataTypes/${dataType}/dataPoints:dailyRollUp`;
  }

  const googleHealthWeightData = await fetchFromGoogleHealth(
    getGoogleHealthUrl("weight"),
    parsedValues,
    googleHealthWeightSchema,
    accessToken,
  );

  const googleHealthBodyFatData = await fetchFromGoogleHealth(
    getGoogleHealthUrl("body-fat"),
    parsedValues,
    googleHealthBodyFatSchema,
    accessToken,
  );

  const googleHealthStepsData = await fetchFromGoogleHealth(
    getGoogleHealthUrl("steps"),
    parsedValues,
    googleHealthStepsSchema,
    accessToken,
  );

  const googleHealthCaloriesData = await fetchFromGoogleHealth(
    getGoogleHealthUrl("total-calories"),
    parsedValues,
    googleHealthCaloriesSchema,
    accessToken,
  );

  const failures: string[] = [];

  if ("error" in googleHealthWeightData) {
    failures.push("体重");
  } else if (googleHealthWeightData.rollupDataPoints.length > 0) {
    await upsertWeightLogs(googleHealthWeightData, user.id, connection.id);
  }

  if ("error" in googleHealthBodyFatData) {
    failures.push("体脂肪率");
  } else if (googleHealthBodyFatData.rollupDataPoints.length > 0) {
    await upsertBodyFatLogs(googleHealthBodyFatData, user.id, connection.id);
  }

  if ("error" in googleHealthStepsData) {
    failures.push("歩数");
  } else if (googleHealthStepsData.rollupDataPoints.length > 0) {
    await upsertStepsLogs(googleHealthStepsData, user.id, connection.id);
  }

  if ("error" in googleHealthCaloriesData) {
    failures.push("カロリー");
  } else if (googleHealthCaloriesData.rollupDataPoints.length > 0) {
    await upsertCaloriesLogs(googleHealthCaloriesData, user.id, connection.id);
  }

  if (failures.length === 4) {
    return {
      success: false,
      error:
        "Google Health API のデータ取得に失敗しました。時間をおいて再度お試しください。",
    };
  }

  return {
    success: failures.length === 0,
    error: failures.length
      ? `${failures.join("・")}の取得に失敗しました。他のデータは保存しました。`
      : undefined,
  };
}

const toCivilDate = (dateString: string, addDays: number = 0) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const addDate = new Date(year, month - 1, day + addDays);

  return {
    date: {
      year: addDate.getFullYear(),
      month: addDate.getMonth() + 1,
      day: addDate.getDate(),
    },
  };
};

async function fetchFromGoogleHealth<T extends z.ZodTypeAny>(
  path: string,
  values: GoogleHealthDataSyncFormValues,
  schema: T,
  accessToken: string,
) {
  const { startDate, endDate } = values;

  const civilTimeInterval = {
    start: toCivilDate(startDate),
    end: toCivilDate(endDate, 1),
  };

  const response = await fetch(`${googleHealthEnv.apiBaseUrl}${path}`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ range: civilTimeInterval }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    return {
      error: "Google Health API のデータ取得に失敗しました。",
    };
  }

  const data = await response.json();

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    console.error("Google Health response parse failed", {
      path,
      error: parsed.error,
    });
    return {
      error: "Google Health API のデータ取得に失敗しました。",
    };
  }
  return parsed.data;
}
