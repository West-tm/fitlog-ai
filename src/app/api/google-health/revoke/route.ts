import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/get-user";
import { decryptGoogleHealthToken } from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";

const GOOGLE_OAUTH_REVOKE_URL = "https://oauth2.googleapis.com/revoke";

function redirectToIntegrations(request: NextRequest, notice: string) {
  const redirectUrl = new URL("/settings/integrations", request.url);

  redirectUrl.searchParams.set("notice", notice);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  const user = await getUser();

  const connection = await prisma.googleHealthConnection.findFirst({
    where: { userId: user.id },
    select: {
      id: true,
      refreshToken: true,
    },
  });

  if (!connection) {
    return redirectToIntegrations(request, "google-health-not-connected");
  }

  try {
    const revokeResponse = await fetch(GOOGLE_OAUTH_REVOKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: decryptGoogleHealthToken(connection.refreshToken),
      }),
      cache: "no-store",
    });

    if (!revokeResponse.ok) {
      const error = await revokeResponse.json();

      if (error.error === "invalid_token") {
        // Google 側ではもう無効なので、アプリ側の記録も消してよい
        await prisma.googleHealthConnection.delete({
          where: { userId: user.id },
        });

        return redirectToIntegrations(request, "google-health-disconnected");
      }

      return redirectToIntegrations(request, "google-health-disconnect-failed");
    }
  } catch {
    return redirectToIntegrations(request, "google-health-disconnect-failed");
  }

  await prisma.googleHealthConnection.delete({
    where: { userId: user.id },
  });

  return redirectToIntegrations(request, "google-health-disconnected");
}
