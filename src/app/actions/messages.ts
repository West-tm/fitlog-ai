"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getMessage(id: string) {
  const user = await getUser();

  const message = await prisma.message.findFirst({
    where: { id, userId: user.id },
  });

  return message;
}

export async function getMessagesByChatId(chatId: string) {
  const user = await getUser();

  const messages = await prisma.message.findMany({
    where: { chatId, userId: user.id },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      prompt: {
        where: { userId: user.id },
      },
      feedbacks: {
        where: { userId: user.id },
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      },
    },
  });

  return messages;
}

export async function deleteMessage(id: string) {
  const user = await getUser();

  const result = await prisma.message.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象のメッセージが見つかりません。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}
