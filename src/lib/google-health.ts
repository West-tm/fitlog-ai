import { google } from "googleapis";

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

export async function getGoogleHealthIdentity(accessToken: string) {
  const response = await fetch(
    `${getGoogleHealthApiBaseUrl()}/users/me/identity`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Google Health identity fetch failed");
  }

  return (await response.json()) as GoogleHealthIdentity;
}
