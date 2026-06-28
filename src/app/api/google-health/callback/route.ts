import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/get-user";
import { getGoogleHealthIdentity } from "@/lib/google-health/actions";
import { googleHealthEnv } from "@/lib/google-health/env";
import { createGoogleHealthOAuthClient } from "@/lib/google-health/google-health";
import { encryptGoogleHealthToken } from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

import { GOOGLE_HEALTH_OAUTH_STATE } from "../auth/route";
import { googleHealthCallbackSchema } from "./schema";

export const runtime = "nodejs";

const redirectToIntegrations = (
  request: NextRequest,
  value: string = "google-health-callback-invalid",
  query: string = "error",
) => {
  const redirectUrl = new URL("/settings/integrations", request.url);
  redirectUrl.searchParams.set(query, value);

  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  response.cookies.delete(GOOGLE_HEALTH_OAUTH_STATE);
  return response;
};

const getTokensByCode = async (code: string) => {
  try {
    const { tokens } = await createGoogleHealthOAuthClient().getToken(code);
    return tokens;
  } catch (error) {
    console.error("Google Health token exchange failed", error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  const user = await getUser();

  const searchParams = request.nextUrl.searchParams;

  if (searchParams.get("error")) {
    return redirectToIntegrations(request);
  }

  const result = googleHealthCallbackSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  const savedState = request.cookies.get(GOOGLE_HEALTH_OAUTH_STATE)?.value;

  if (!result.success || !savedState || result.data.state !== savedState) {
    console.warn("Google Health callback params invalid", {
      hasCode: searchParams.has("code"),
      hasState: searchParams.has("state"),
    });

    return redirectToIntegrations(request);
  }

  const { code, scope } = result.data;

  const tokens = await getTokensByCode(code);

  if (!tokens || !tokens.access_token) {
    return redirectToIntegrations(request);
  }

  const currentConnection = await prisma.googleHealthConnection.findUnique({
    where: { userId: user.id },
    select: { refreshToken: true },
  });

  const encryptedRefreshToken = tokens.refresh_token
    ? encryptGoogleHealthToken(tokens.refresh_token)
    : currentConnection?.refreshToken;

  if (!encryptedRefreshToken) {
    return redirectToIntegrations(request);
  }

  const identity = await getGoogleHealthIdentity(tokens.access_token);

  if (!identity) {
    return redirectToIntegrations(request);
  }

  const connectionData = {
    googleUserId: identity.healthUserId ?? null,
    scope: scope ?? googleHealthEnv.scopes.join(" "),
    refreshToken: encryptedRefreshToken,
    accessToken: encryptGoogleHealthToken(tokens.access_token),
    expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
  };

  try {
    await prisma.googleHealthConnection.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...connectionData,
      },
      update: connectionData,
    });

    return redirectToIntegrations(request, "google-health-connected", "notice");
  } catch {
    return redirectToIntegrations(request);
  }
}
