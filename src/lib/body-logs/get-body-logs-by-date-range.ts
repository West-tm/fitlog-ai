import "server-only";

import { getUser } from "@/lib/auth/get-user";
import { toTokyoDateString, toUtcDateFromIsoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma/prisma";

export async function getBodyLogsByDateRange(
  startDate: string,
  endDate: string,
) {
  const user = await getUser();

  const bodyLogs = await prisma.bodyLog.findMany({
    where: {
      userId: user.id,
      measuredOn: {
        gte: toUtcDateFromIsoDate(startDate),
        lte: toUtcDateFromIsoDate(endDate),
      },
    },
    orderBy: { measuredOn: "asc" },
  });

  return bodyLogs.flatMap((log) => {
    if (log.weightGramsAvg === null && log.bodyFatPercentageAvg === null) {
      return [];
    }

    return [
      {
        date: toTokyoDateString(log.measuredOn),
        weightKg:
          log.weightGramsAvg !== null ? log.weightGramsAvg / 1000 : undefined,
        bodyFatPercentage:
          log.bodyFatPercentageAvg !== null
            ? log.bodyFatPercentageAvg
            : undefined,
      },
    ];
  });
}
