import "server-only";

import { revalidatePath } from "next/cache";

import {
  GoogleHealthBodyFat,
  GoogleHealthWeight,
} from "@/lib/google-health/validations";
import { prisma } from "@/lib/prisma/prisma";

const toRecordDate = (date: { year: number; month: number; day: number }) => {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
};

export async function upsertWeightLogs(
  logs: GoogleHealthWeight,
  userId: string,
  googleHealthConnectionId: string,
) {
  await prisma.$transaction(
    logs.rollupDataPoints.map((log) => {
      const measuredOn = toRecordDate(log.civilStartTime.date);

      const logData = {
        googleHealthConnectionId,
        weightGramsAvg: log.weight.weightGramsAvg,
      };

      return prisma.bodyLog.upsert({
        where: {
          userId_measuredOn: {
            userId,
            measuredOn,
          },
        },
        update: logData,
        create: {
          userId,
          measuredOn,
          ...logData,
        },
      });
    }),
  );

  revalidatePath("/health");
}

export async function upsertBodyFatLogs(
  logs: GoogleHealthBodyFat,
  userId: string,
  googleHealthConnectionId: string,
) {
  await prisma.$transaction(
    logs.rollupDataPoints.map((log) => {
      const measuredOn = toRecordDate(log.civilStartTime.date);

      const logData = {
        googleHealthConnectionId,
        bodyFatPercentageAvg: log.bodyFat.bodyFatPercentageAvg,
      };

      return prisma.bodyLog.upsert({
        where: {
          userId_measuredOn: {
            userId,
            measuredOn,
          },
        },
        update: logData,
        create: {
          userId,
          measuredOn,
          ...logData,
        },
      });
    }),
  );

  revalidatePath("/health");
}
