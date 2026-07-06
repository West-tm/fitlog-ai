"use server";

import { z } from "zod";

import { getUser } from "../auth/get-user";
import { upsertBodyLogsFromGoogleHealth } from "../body-logs/upsert-body-logs";
import { prisma } from "../prisma/prisma";
import { googleHealthEnv } from "./env";
import { getGoogleHealthAccessToken } from "./google-health";
import {
  googleHealthWeightSyncFormSchema,
  GoogleHealthWeightSyncFormValues,
  googleHealthWeightSchema,
} from "./validations";

export async function getGoogleHealthConnectionSelectId() {
  const user = await getUser();

  const connection = await prisma.googleHealthConnection.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  return connection;
}

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

export async function syncGoogleHealthWeightLogs(
  path: string,
  values: GoogleHealthWeightSyncFormValues,
) {
  const parsedValues = googleHealthWeightSyncFormSchema.parse(values);

  const googleHealthData = await fetchFromGoogleHealth(path, parsedValues);

  if ("error" in googleHealthData) {
    return { success: false, error: googleHealthData.error };
  }

  await upsertBodyLogsFromGoogleHealth(googleHealthData);

  return { success: true };
}

async function fetchFromGoogleHealth(
  path: string,
  values: GoogleHealthWeightSyncFormValues,
) {
  const { startDate, endDate } = values;

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

  const civilTimeInterval = {
    start: toCivilDate(startDate),
    end: toCivilDate(endDate, 1),
  };

  const accessToken = await getGoogleHealthAccessToken();

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
      error:
        "Google Health API のデータ取得に失敗しました。時間をおいて再度お試しください。",
    };
  }

  const data = await response.json();

  return googleHealthWeightSchema.parse(data);
}
