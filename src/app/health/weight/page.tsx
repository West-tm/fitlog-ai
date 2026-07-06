import { getBodyLogs } from "@/app/actions/body-logs";
import GoogleHealthWeightSyncForm from "@/components/health/google-health-weight-sync-form";
import ChartAreaInteractive from "@/components/health/weight-chart-area-interactive";
import { syncGoogleHealthWeightLogs } from "@/lib/google-health/actions";

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
        Google Health API 体重データ取得
      </h1>

      <GoogleHealthWeightSyncForm
        onSubmitAction={syncGoogleHealthWeightLogs.bind(
          null,
          "/users/me/dataTypes/weight/dataPoints:dailyRollUp",
        )}
      />

      <ChartAreaInteractive chartData={chartData} />
    </div>
  );
}
