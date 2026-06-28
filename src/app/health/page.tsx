import { z } from "zod";

import { googleHealthEnv } from "@/lib/google-health/env";
import { getGoogleHealthAccessToken } from "@/lib/google-health/google-health";

const googleHealthProfileSchema = z.object({
  name: z.string(),
  age: z.int(),
  membershipStartDate: z.object({
    year: z.int(),
    month: z.int(),
    day: z.int(),
  }),
});

export async function fetchGoogleHealthJson<TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
) {
  const accessToken = await getGoogleHealthAccessToken();

  const response = await fetch(`${googleHealthEnv.apiBaseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("Google Health API request failed");
  }

  const data: unknown = await response.json();
  return schema.parse(data);
}

export default async function GoogleHealthPage() {
  const profile = await fetchGoogleHealthJson(
    "/users/me/profile",
    googleHealthProfileSchema,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Google Health API TestPage</h1>
      <div>{JSON.stringify(profile)}</div>
    </div>
  );
}
