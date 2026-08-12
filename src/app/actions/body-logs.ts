"use server";

import { getUser } from "@/lib/auth/get-user";
import { toTokyoDateString } from "@/lib/date";
import { prisma } from "@/lib/prisma/prisma";

export async function getBodyLogs() {
  const user = await getUser();

  return await prisma.bodyLog.findMany({
    where: { userId: user.id },
    orderBy: { measuredOn: "asc" },
  });
}

export async function getBodyLogsByStartDateAndEndDate(
  startDate: Date,
  endDate: Date,
) {
  const user = await getUser();

  const bodyLogs = await prisma.bodyLog.findMany({
    where: { userId: user.id, measuredOn: { gte: startDate, lte: endDate } },
    orderBy: { measuredOn: "asc" },
  });

  return bodyLogs.flatMap((log) => {
    if (log.weightGramsAvg === null) return [];

    return [
      {
        date: toTokyoDateString(log.measuredOn),
        weightKg: log.weightGramsAvg / 1000,
      },
    ];
  });
}
