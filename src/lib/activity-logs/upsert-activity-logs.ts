import "server-only";

import { revalidatePath } from "next/cache";

import {
  GoogleHealthCalories,
  GoogleHealthSteps,
} from "@/lib/google-health/validations";
import { prisma } from "@/lib/prisma/prisma";

const toRecordDate = (date: { year: number; month: number; day: number }) => {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
};

export async function upsertStepsLogs(
  logs: GoogleHealthSteps,
  userId: string,
  googleHealthConnectionId: string,
) {
  await prisma.$transaction(
    logs.rollupDataPoints.map((log) => {
      const measuredOn = toRecordDate(log.civilStartTime.date);

      const logData = {
        googleHealthConnectionId,
        stepsCountSum: log.steps.countSum,
      };

      return prisma.activityLog.upsert({
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

export async function upsertCaloriesLogs(
  logs: GoogleHealthCalories,
  userId: string,
  googleHealthConnectionId: string,
) {
  await prisma.$transaction(
    logs.rollupDataPoints.map((log) => {
      const measuredOn = toRecordDate(log.civilStartTime.date);

      const logData = {
        googleHealthConnectionId,
        totalCaloriesKcalSum: log.totalCalories.kcalSum,
      };

      return prisma.activityLog.upsert({
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
