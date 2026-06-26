import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/get-user";
import { googleHealthEnv } from "@/lib/google-health/env";
import {
  createGoogleHealthOAuthClient,
  getGoogleHealthIdentity,
  GOOGLE_HEALTH_OAUTH_STATE,
} from "@/lib/google-health/google-health";
import { encryptGoogleHealthToken } from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";

function redirectToIntegrations(
  request: NextRequest,
  value: string,
  query: string = "error",
) {
  const redirectUrl = new URL("/settings/integrations", request.url);

  redirectUrl.searchParams.set(query, value);

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  response.cookies.delete(GOOGLE_HEALTH_OAUTH_STATE);

  return response;
}

export async function GET(request: NextRequest) {
  const user = await getUser();

  const searchParams = request.nextUrl.searchParams;

  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const scope = searchParams.get("scope");

  if (error) {
    return redirectToIntegrations(request, "google-health-cancelled");
  }

  if (!code) {
    return redirectToIntegrations(request, "authorization-code-missing");
  }

  const savedState = request.cookies.get(GOOGLE_HEALTH_OAUTH_STATE)?.value;

  if (!state || !savedState || state !== savedState) {
    return redirectToIntegrations(request, "invalid-oauth-state");
  }

  const oauth2Client = createGoogleHealthOAuthClient();

  let tokens;

  try {
    const result = await oauth2Client.getToken(code);
    tokens = result.tokens;
  } catch (error) {
    console.error("Google Health token exchange failed", error);

    return redirectToIntegrations(request, "token-exchange-failed");
  }

  if (!tokens.access_token) {
    return redirectToIntegrations(request, "token-exchange-failed");
  }

  const currentConnection = await prisma.googleHealthConnection.findFirst({
    where: { userId: user.id },
    select: { refreshToken: true },
  });

  const encryptedRefreshToken = tokens.refresh_token
    ? encryptGoogleHealthToken(tokens.refresh_token)
    : currentConnection?.refreshToken;

  if (!encryptedRefreshToken) {
    return redirectToIntegrations(request, "refresh-token-missing");
  }

  let identity;

  try {
    identity = await getGoogleHealthIdentity(tokens.access_token);
  } catch {
    return redirectToIntegrations(request, "get-google-health-identity-failed");
  }

  const grantedScope = scope ?? googleHealthEnv.scopes.join(" ");

  try {
    await prisma.googleHealthConnection.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        googleUserId: identity.healthUserId ?? null,
        scope: grantedScope,
        refreshToken: encryptedRefreshToken,
        accessToken: encryptGoogleHealthToken(tokens.access_token),
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      update: {
        googleUserId: identity.healthUserId ?? null,
        scope: grantedScope,
        refreshToken: encryptedRefreshToken,
        accessToken: encryptGoogleHealthToken(tokens.access_token),
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    return redirectToIntegrations(request, "google-health-connected", "notice");
  } catch {
    return redirectToIntegrations(request, "google-health-upsert-failed");
  }
}
