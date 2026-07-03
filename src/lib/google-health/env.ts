import { z } from "zod";

const urlEnv = (name: string) =>
  z
    .string()
    .trim()
    .refine((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, `${name} must be a valid URL`);

const googleHealthEnvSchema = z
  .object({
    GOOGLE_HEALTH_CLIENT_ID: z.string().min(1),
    GOOGLE_HEALTH_CLIENT_SECRET: z.string().min(1),
    GOOGLE_HEALTH_REDIRECT_URI: urlEnv("GOOGLE_HEALTH_REDIRECT_URI"),
    GOOGLE_HEALTH_SCOPES: z.string().trim().min(1),
    GOOGLE_HEALTH_API_BASE_URL: urlEnv("GOOGLE_HEALTH_API_BASE_URL"),
    GOOGLE_HEALTH_TOKEN_ENCRYPTION_KEY: z
      .string()
      .refine(
        (value) => Buffer.from(value, "base64").length === 32,
        "GOOGLE_HEALTH_TOKEN_ENCRYPTION_KEY must be 32 bytes base64",
      ),
  })
  .transform((env) => ({
    clientId: env.GOOGLE_HEALTH_CLIENT_ID,
    clientSecret: env.GOOGLE_HEALTH_CLIENT_SECRET,
    redirectUri: env.GOOGLE_HEALTH_REDIRECT_URI,
    scopes: env.GOOGLE_HEALTH_SCOPES.split(/\s+/),
    apiBaseUrl: env.GOOGLE_HEALTH_API_BASE_URL.replace(/\/$/, ""),
  }));

export const googleHealthEnv = googleHealthEnvSchema.parse(process.env);
