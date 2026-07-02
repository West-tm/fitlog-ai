import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  createGoogleHealthOAuthClient,
  getGoogleHealthScopes,
  GOOGLE_HEALTH_OAUTH_STATE,
} from "@/lib/google-health/google-health";

export const runtime = "nodejs";

export async function GET() {
  const oauth2Client = createGoogleHealthOAuthClient();
  const state = randomUUID();

  //  Google Health API の同意画面URLを生成
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: getGoogleHealthScopes(),
    state,
  });

  const response = NextResponse.redirect(authUrl);

  response.cookies.set(GOOGLE_HEALTH_OAUTH_STATE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
