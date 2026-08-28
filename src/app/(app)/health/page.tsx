import { getActivityLogs } from "@/app/actions/activity-logs";
import { getBodyLogs } from "@/app/actions/body-logs";
import TrendChart from "@/components/health/trend-chart";
import { toTokyoDateString } from "@/lib/date";

export const metadata = {
  title: "健康データ",
};

function toChartPoints<T extends { measuredOn: Date }>(
  logs: T[],
  getValue: (log: T) => number | null,
) {
  return logs.flatMap((log) => {
    const value = getValue(log);
    if (value === null) return [];

    return [{ date: toTokyoDateString(log.measuredOn), value }];
  });
}

export default async function GoogleHealthPage() {
  const [bodyLogs, activityLogs] = await Promise.all([
    getBodyLogs(),
    getActivityLogs(),
  ]);

  const weightChartData = toChartPoints(bodyLogs, (log) =>
    log.weightGramsAvg === null ? null : log.weightGramsAvg / 1000,
  );
  const bodyFatPercentageChartData = toChartPoints(
    bodyLogs,
    (log) => log.bodyFatPercentageAvg,
  );
  const totalCaloriesChartData = toChartPoints(
    activityLogs,
    (log) => log.totalCaloriesKcalSum,
  );
  const stepsChartData = toChartPoints(
    activityLogs,
    (log) => log.stepsCountSum,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Google Health API 健康データ一覧
      </h1>
      <TrendChart
        chartData={weightChartData}
        label="体重"
        unit="kg"
        fractionDigits={1}
      />
      <TrendChart
        chartData={bodyFatPercentageChartData}
        label="体脂肪率"
        unit="%"
        fractionDigits={1}
      />

      <TrendChart
        chartData={totalCaloriesChartData}
        label="消費カロリー"
        unit="kcal"
      />
      <TrendChart chartData={stepsChartData} label="歩数" unit="歩" />
    </div>
  );
}
