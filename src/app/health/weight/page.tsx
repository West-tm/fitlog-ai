import { getBodyLogs } from "@/app/actions/bodyLogs";
import { WeightChart } from "@/components/health/weight-chart";
import { Button } from "@/components/ui/button";
import { fetchGoogleHealthJson } from "@/lib/google-health/actions";

export default async function GoogleHealthWeightPage() {
  const bodyLogs = await getBodyLogs();

  const chartData = bodyLogs.flatMap((log) => {
    if (log.weightGramsAvg === null) return [];

    return [
      {
        date: log.measuredOn.toISOString().slice(0, 10),
        weightKg: log.weightGramsAvg / 1000,
      },
    ];
  });

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

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">体重推移</h2>
        <WeightChart data={chartData} />
      </section>

      {bodyLogs.map((log) => (
        <div key={log.id}>
          {log.weightGramsAvg}：{log.measuredOn.toLocaleDateString()}
        </div>
      ))}
    </div>
  );
}
