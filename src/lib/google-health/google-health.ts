import { google } from "googleapis";
import { redirect } from "next/navigation";

import {
  decryptGoogleHealthToken,
  encryptGoogleHealthToken,
} from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

import { getUser } from "../auth/get-user";

export const GOOGLE_HEALTH_OAUTH_STATE = "google_health_oauth_state";

type GoogleHealthIdentity = {
  name: string;
  legacyUserId?: string;
  healthUserId?: string;
};

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) throw new Error(`${name} is not set`);

  return value;
}

export function createGoogleHealthOAuthClient() {
  return new google.auth.OAuth2(
    getEnv("GOOGLE_HEALTH_CLIENT_ID"),
    getEnv("GOOGLE_HEALTH_CLIENT_SECRET"),
    getEnv("GOOGLE_HEALTH_REDIRECT_URI"),
  );
}

export function getGoogleHealthScopes() {
  return getEnv("GOOGLE_HEALTH_SCOPES").trim().split(/\s+/).filter(Boolean);
}

export function getGoogleHealthApiBaseUrl() {
  return getEnv("GOOGLE_HEALTH_API_BASE_URL").replace(/\/$/, "");
}

const GOOGLE_HEALTH_REQUEST_TIMEOUT_MS = 10_000;

export async function getGoogleHealthIdentity(accessToken: string) {
  const response = await fetch(
    `${getGoogleHealthApiBaseUrl()}/users/me/identity`,
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

  return (await response.json()) as GoogleHealthIdentity;
}

const ACCESS_TOKEN_REFRESH_MARGIN_MS = 60 * 1000;

export async function getGoogleHealthAccessToken() {
  const user = await getUser();

  const connection = await prisma.googleHealthConnection.findUnique({
    where: { userId: user.id },
    select: {
      refreshToken: true,
      accessToken: true,
      expiresAt: true,
    },
  });

  if (!connection) {
    redirect("/settings/integrations?notice=google-health-not-connected");
  }

  if (
    connection.accessToken &&
    connection.expiresAt &&
    connection.expiresAt.getTime() > Date.now() + ACCESS_TOKEN_REFRESH_MARGIN_MS
  ) {
    return decryptGoogleHealthToken(connection.accessToken);
  }

  const oauth2Client = createGoogleHealthOAuthClient();

  oauth2Client.setCredentials({
    refresh_token: decryptGoogleHealthToken(connection.refreshToken),
  });

  const result = await oauth2Client.getAccessToken();

  if (!result.token) {
    throw new Error("Failed to refresh Google Health access token");
  }

  await prisma.googleHealthConnection.update({
    where: { userId: user.id },
    data: {
      accessToken: encryptGoogleHealthToken(result.token),
      expiresAt: oauth2Client.credentials.expiry_date
        ? new Date(oauth2Client.credentials.expiry_date)
        : null,
    },
  });

  return result.token;
}
