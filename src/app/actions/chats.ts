"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { getHealthLogsByDateRange } from "@/lib/health-logs/get-health-logs-by-date-range";
import { prisma } from "@/lib/prisma/prisma";
import {
  updateChatTitleSchema,
  UpdateChatTitleValues,
} from "@/lib/validations/chats";
import {
  createMessageSchema,
  MessageFormValues,
} from "@/lib/validations/messages";

import { geminiGenerateContent } from "./gemini";
import { getPrompt } from "./prompts";

export async function createChat(values: MessageFormValues) {
  const user = await getUser();

  const result = createMessageSchema.safeParse(values);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const healthLogs = await getHealthLogsByDateRange(
    result.data.startDate,
    result.data.endDate,
  );

  const generateResult = await geminiGenerateContent(
    prompt.content,
    null,
    result.data.content,
    result.data.useGoogleSearch,
    healthLogs,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  const chat = await prisma.$transaction(async (tx) => {
    const chat = await tx.chat.create({
      data: {
        title:
          result.data.content.trim().length > 0
            ? result.data.content.trim().slice(0, 40)
            : "新しいチャット",
        userId: user.id,
      },
    });
    const message = await tx.message.create({
      data: {
        content: result.data.content,
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
        userId: user.id,
        chatId: chat.id,
        promptId: prompt.id,
      },
    });
    await tx.feedback.create({
      data: {
        content: generateResult.content,
        promptSnapshot: prompt.content,
        userId: user.id,
        messageId: message.id,
      },
    });

    return chat;
  });

  revalidatePath("/chats");
  redirect(`/chats/${chat.id}`);
}

export async function getChat(id: string) {
  const user = await getUser();

  const chat = await prisma.chat.findUnique({
    where: { id, userId: user.id },
  });

  return chat;
}

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

export async function updateChatTitle(values: UpdateChatTitleValues) {
  const user = await getUser();

  const parsed = updateChatTitleSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "入力内容を確認してください。" };
  }

  const result = await prisma.chat.updateMany({
    where: { id: parsed.data.id, userId: user.id },
    data: { title: parsed.data.title },
  });

  if (result.count === 0) {
    return { error: "変更対象のチャットが見つかりません。" };
  }

  revalidatePath("/chats");
  revalidatePath(`/chats/${parsed.data.id}`);
}

export async function deleteChat(id: string) {
  const user = await getUser();

  const result = await prisma.chat.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象のチャットが見つかりません。",
    };
  }

  revalidatePath("/chats");
}
