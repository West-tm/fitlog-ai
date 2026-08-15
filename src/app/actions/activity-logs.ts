"use server";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getActivityLogs() {
  const user = await getUser();

  return await prisma.activityLog.findMany({
    where: { userId: user.id },
    orderBy: { measuredOn: "asc" },
  });
}
