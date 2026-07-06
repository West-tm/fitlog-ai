import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { getGoogleHealthConnectionSelectId } from "@/lib/google-health/actions";
import {
  GoogleHealthWeightLogs,
  googleHealthWeightSchema,
} from "@/lib/google-health/validations";
import { prisma } from "@/lib/prisma/prisma";

const toRecordDate = (date: { year: number; month: number; day: number }) => {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
};

export async function upsertBodyLogsFromGoogleHealth(
  logs: GoogleHealthWeightLogs,
) {
  const parsedBodyLogs = googleHealthWeightSchema.parse(logs);

  const user = await getUser();

  const connection = await getGoogleHealthConnectionSelectId();

  if (!connection) {
    redirect("/settings/integrations?notice=google-health-not-connected");
  }

  await prisma.$transaction(
    parsedBodyLogs.rollupDataPoints.map((log) => {
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
