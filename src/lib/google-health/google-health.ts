import { google } from "googleapis";

import {
  decryptGoogleHealthToken,
  encryptGoogleHealthToken,
} from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

import { getUser } from "../auth/get-user";
import { googleHealthEnv } from "./env";

export function createGoogleHealthOAuthClient() {
  return new google.auth.OAuth2(
    googleHealthEnv.clientId,
    googleHealthEnv.clientSecret,
    googleHealthEnv.redirectUri,
  );
}

export async function getGoogleHealthAccessToken() {
  const ACCESS_TOKEN_REFRESH_MARGIN_MS = 60 * 1000;

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
    throw new Error("GOOGLE_HEALTH_NOT_CONNECTED");
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
