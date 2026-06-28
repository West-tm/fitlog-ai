import { z } from "zod";

import { googleHealthEnv } from "./env";

const googleHealthIdentitySchema = z.object({
  name: z.string(),
  legacyUserId: z.string().optional(),
  healthUserId: z.string().optional(),
});

export async function getGoogleHealthIdentity(accessToken: string) {
  const GOOGLE_HEALTH_REQUEST_TIMEOUT_MS = 10_000;

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
  } catch (error) {
    console.error("Google Health identity fetch failed", error);
    return null;
  }
}
