import { getBodyLogs } from "@/app/actions/body-logs";
import WeightTrendChart from "@/components/health/weight-trend-chart";

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
        Google Health API 体重推移データ
      </h1>

      <WeightTrendChart chartData={chartData} />
    </div>
  );
}
