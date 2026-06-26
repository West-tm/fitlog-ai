import { z } from "zod";

const googleHealthEnvSchema = z
  .object({
    GOOGLE_HEALTH_CLIENT_ID: z.string().min(1),
    GOOGLE_HEALTH_CLIENT_SECRET: z.string().min(1),
    GOOGLE_HEALTH_REDIRECT_URI: z.string().min(1),
    GOOGLE_HEALTH_SCOPES: z.string().min(1),
    GOOGLE_HEALTH_API_BASE_URL: z.string().min(1),
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
    scopes: env.GOOGLE_HEALTH_SCOPES.trim().split(/\s+/).filter(Boolean),
    apiBaseUrl: env.GOOGLE_HEALTH_API_BASE_URL.replace(/\/$/, ""),
  }));

export const googleHealthEnv = googleHealthEnvSchema.parse(process.env);
