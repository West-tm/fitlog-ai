import "server-only";

import { getUser } from "@/lib/auth/get-user";
import { toTokyoDateString, toUtcDateFromIsoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma/prisma";

export async function getActivityLogsByDateRange(
  startDate: string,
  endDate: string,
) {
  const user = await getUser();

  const activityLogs = await prisma.activityLog.findMany({
    where: {
      userId: user.id,
      measuredOn: {
        gte: toUtcDateFromIsoDate(startDate),
        lte: toUtcDateFromIsoDate(endDate),
      },
    },
    orderBy: { measuredOn: "asc" },
  });

  return activityLogs.flatMap((log) => {
    if (log.stepsCountSum === null && log.totalCaloriesKcalSum === null) {
      return [];
    }

    return [
      {
        date: toTokyoDateString(log.measuredOn),
        stepsCount: log.stepsCountSum !== null ? log.stepsCountSum : undefined,
        totalCaloriesKcal:
          log.totalCaloriesKcalSum !== null
            ? log.totalCaloriesKcalSum
            : undefined,
      },
    ];
  });
}
