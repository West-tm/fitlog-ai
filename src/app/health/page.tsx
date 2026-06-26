import { googleHealthEnv } from "@/lib/google-health/env";
import { getGoogleHealthAccessToken } from "@/lib/google-health/google-health";

export async function fetchGoogleHealthJson<T>(
  accessToken: string,
  path: string,
) {
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

  return (await response.json()) as T;
}

export default async function GoogleHealthPage() {
  const accessToken = await getGoogleHealthAccessToken();

  const profile = await fetchGoogleHealthJson(accessToken, "/users/me/profile");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Google Health API TestPage</h1>
      <div>{JSON.stringify(profile)}</div>
    </div>
  );
}
