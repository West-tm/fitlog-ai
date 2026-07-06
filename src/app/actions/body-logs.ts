"use server";

import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { getGoogleHealthConnectionSelectId } from "@/lib/google-health/actions";
import { prisma } from "@/lib/prisma/prisma";

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
        gte: new Date(Date.UTC(2026, 0, 1)),
        lte: new Date(Date.UTC(2026, 11, 31)),
      },
    },
    orderBy: {
      measuredOn: "asc",
    },
  });

  return bodyLogs;
}
