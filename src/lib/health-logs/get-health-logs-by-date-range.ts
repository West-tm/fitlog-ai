import { getActivityLogsByDateRange } from "@/lib/activity-logs/get-activity-logs-by-date-range";
import { getBodyLogsByDateRange } from "@/lib/body-logs/get-body-logs-by-date-range";
import { HealthLogForGemini } from "@/lib/types/gemini";

function mergeHealthLogs(
  bodyLogs: { date: string; weightKg?: number; bodyFatPercentage?: number }[],
  activityLogs: {
    date: string;
    stepsCount?: number;
    totalCaloriesKcal?: number;
  }[],
): HealthLogForGemini[] {
  const byDate = new Map<string, HealthLogForGemini>();

  for (const log of bodyLogs) {
    byDate.set(log.date, { ...log });
  }
  for (const log of activityLogs) {
    byDate.set(log.date, { ...byDate.get(log.date), ...log });
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getHealthLogsByDateRange(
  startDate: string,
  endDate: string,
) {
  const [bodyLogs, activityLogs] = await Promise.all([
    getBodyLogsByDateRange(startDate, endDate),
    getActivityLogsByDateRange(startDate, endDate),
  ]);
  return mergeHealthLogs(bodyLogs, activityLogs);
}
