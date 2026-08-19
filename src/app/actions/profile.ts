"use server";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getProfile() {
  const user = await getUser();

  const userProfile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return userProfile;
}
