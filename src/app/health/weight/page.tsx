import { z } from "zod";

import { googleHealthEnv } from "@/lib/google-health/env";
import { getGoogleHealthAccessToken } from "@/lib/google-health/google-health";

const CivilDateTimeSchema = z.object({
  date: z.object({
    year: z.int(),
    month: z.int(),
    day: z.int(),
  }),
});

const googleHealthWeightSchema = z.object({
  rollupDataPoints: z.array(
    z.object({
      civilStartTime: CivilDateTimeSchema,
      civilEndTime: CivilDateTimeSchema,
      weight: z.object({ weightGramsAvg: z.int() }),
    }),
  ),
});

const fetchGoogleHealthJson = async <TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
) => {
  const CivilTimeInterval = {
    start: { date: { year: 2026, month: 6, day: 4 } },
    end: { date: { year: 2026, month: 7, day: 4 } },
  };

  const accessToken = await getGoogleHealthAccessToken();

  const response = await fetch(`${googleHealthEnv.apiBaseUrl}${path}`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ range: CivilTimeInterval }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("Google Health API request failed");
  }

  const data: unknown = await response.json();
  return schema.parse(data);
};

export default async function GoogleHealthWeightPage() {
  const res = await fetchGoogleHealthJson(
    "/users/me/dataTypes/weight/dataPoints:dailyRollUp",
    googleHealthWeightSchema,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Google Health API Weight TestPage
      </h1>
      <div>{JSON.stringify(res)}</div>
    </div>
  );
}
