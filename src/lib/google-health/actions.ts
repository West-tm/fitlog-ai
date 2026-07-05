"use server";

import { z } from "zod";

import { upsertBodyLogs } from "@/app/actions/bodyLogs";

import { getUser } from "../auth/get-user";
import { prisma } from "../prisma/prisma";
import { googleHealthEnv } from "./env";
import { getGoogleHealthAccessToken } from "./google-health";
import { googleHealthWeightSchema } from "./validations";

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

export async function fetchGoogleHealthJson(path: string) {
  const CivilTimeInterval = {
    start: { date: { year: 2026, month: 6, day: 4 } },
    end: { date: { year: 2026, month: 7, day: 4 } },
  };

  const accessToken = await getGoogleHealthAccessToken();

  const response = await fetch(`${googleHealthEnv.apiBaseUrl}${path}`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ range: CivilTimeInterval }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("Google Health API request failed");
  }

  const data: unknown = await response.json();
  const googleHealthWeightLogs = googleHealthWeightSchema.parse(data);

  await upsertBodyLogs(googleHealthWeightLogs);
}
