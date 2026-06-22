import { NextRequest, NextResponse } from "next/server";

import {
  createGoogleHealthOAuthClient,
  getGoogleHealthApiBaseUrl,
} from "@/lib/google-health";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (error) {
    return NextResponse.json(
      { error: "Google OAuth authorization failed", detail: error },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 },
    );
  }

  const savedState = request.cookies.get("google_health_oauth_state")?.value;

  if (!state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  const oauth2Client = createGoogleHealthOAuthClient();

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const profileResponse = await oauth2Client.request({
    url: `${getGoogleHealthApiBaseUrl()}/v4/users/me/profile`,
    method: "GET",
  });

  const response = NextResponse.json({
    message: "Google Health API connection succeeded",
    hasAccessToken: Boolean(tokens.access_token),
    hasRefreshToken: Boolean(tokens.refresh_token),
    profile: profileResponse.data,
  });

  response.cookies.delete("google_health_oauth_state");

  return response;
}
