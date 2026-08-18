"use server";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getBodyLogs() {
  const user = await getUser();

  return await prisma.bodyLog.findMany({
    where: { userId: user.id },
    orderBy: { measuredOn: "asc" },
  });
}
