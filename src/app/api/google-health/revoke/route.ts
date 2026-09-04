import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/get-user";
import { decryptGoogleHealthToken } from "@/lib/google-health/google-health-token-crypto";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";

const redirectToIntegrations = (request: NextRequest, flash: string) => {
  const redirectUrl = new URL("/settings/integrations", request.url);

  redirectUrl.searchParams.set("flash", flash);

  return NextResponse.redirect(redirectUrl, { status: 303 });
};

const deleteGoogleHealthConnection = async (id: string) => {
  await prisma.googleHealthConnection.delete({
    where: { id },
  });
};

export async function POST(request: NextRequest) {
  const GOOGLE_OAUTH_REVOKE_URL = "https://oauth2.googleapis.com/revoke";

  const user = await getUser();

  const connection = await prisma.googleHealthConnection.findUnique({
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
        await deleteGoogleHealthConnection(connection.id);

        return redirectToIntegrations(request, "google-health-disconnected");
      }

      return redirectToIntegrations(request, "google-health-disconnect-failed");
    }
  } catch {
    return redirectToIntegrations(request, "google-health-disconnect-failed");
  }

  await deleteGoogleHealthConnection(connection.id);

  return redirectToIntegrations(request, "google-health-disconnected");
}
