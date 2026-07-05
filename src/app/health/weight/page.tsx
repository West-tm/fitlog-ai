import { getBodyLogs } from "@/app/actions/bodyLogs";
import { Button } from "@/components/ui/button";
import { fetchGoogleHealthJson } from "@/lib/google-health/actions";

export default async function GoogleHealthWeightPage() {
  const bodyLogs = await getBodyLogs();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Google Health API Weight TestPage
      </h1>

      <form
        action={fetchGoogleHealthJson.bind(
          null,
          "/users/me/dataTypes/weight/dataPoints:dailyRollUp",
        )}
      >
        <p>Google Health API Weightデータ取得</p>
        <Button className="cursor-pointer">データ取得</Button>
      </form>

      {bodyLogs.map((log) => (
        <div key={log.id}>
          {log.weightGramsAvg}：{log.measuredOn.toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}
