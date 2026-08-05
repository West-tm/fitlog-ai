"use server";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getChats() {
  const user = await getUser();

  const chats = await prisma.chat.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return chats;
}

export async function getChat(id: string) {
  const user = await getUser();

  const chat = await prisma.chat.findUnique({
    where: { id, userId: user.id },
  });

  return chat;
}
