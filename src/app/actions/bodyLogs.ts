"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { getGoogleHealthConnectionSelectId } from "@/lib/google-health/actions";
import {
  googleHealthWeightLogs,
  googleHealthWeightSchema,
} from "@/lib/google-health/validations";
import { prisma } from "@/lib/prisma/prisma";

export async function upsertBodyLogs(logs: googleHealthWeightLogs) {
  const parsedLogs = googleHealthWeightSchema.parse(logs);

  const user = await getUser();

  const connection = await getGoogleHealthConnectionSelectId();

  if (!connection) {
    redirect("/settings/integrations?notice=google-health-not-connected");
  }

  const toRecordDate = (date: { year: number; month: number; day: number }) => {
    return new Date(Date.UTC(date.year, date.month - 1, date.day));
  };

  await prisma.$transaction(
    parsedLogs.rollupDataPoints.map((log) => {
      const measuredOn = toRecordDate(log.civilStartTime.date);

      const bodyLogData = {
        googleHealthConnectionId: connection.id,
        weightGramsAvg: log.weight.weightGramsAvg,
      };

      return prisma.bodyLog.upsert({
        where: {
          userId_measuredOn: {
            userId: user.id,
            measuredOn,
          },
        },
        update: bodyLogData,
        create: {
          userId: user.id,
          measuredOn,
          ...bodyLogData,
        },
      });
    }),
  );

  revalidatePath("/health/weight");
}

export async function getBodyLogs() {
  const user = await getUser();

  const connection = await getGoogleHealthConnectionSelectId();

  if (!connection) {
    redirect("/settings/integrations?notice=google-health-not-connected");
  }

  const bodyLogs = await prisma.bodyLog.findMany({
    where: {
      userId: user.id,
      measuredOn: {
        gte: new Date(Date.UTC(2026, 5, 4)),
        lte: new Date(Date.UTC(2026, 6, 4)),
      },
    },
    orderBy: {
      measuredOn: "asc",
    },
  });

  return bodyLogs;
}
