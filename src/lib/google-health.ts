import { google } from "googleapis";

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

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
  return getEnv("GOOGLE_HEALTH_API_BASE_URL");
}

export const GOOGLE_HEALTH_OAUTH_STATE = "google_health_oauth_state";
