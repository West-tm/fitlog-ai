"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/get-user";
import { getHealthLogsByDateRange } from "@/lib/health-logs/get-health-logs-by-date-range";
import { prisma } from "@/lib/prisma/prisma";
import {
  createMessageSchema,
  MessageFormValues,
  updateMessageSchema,
} from "@/lib/validations/messages";

import { getChat } from "./chats";
import { geminiGenerateContent } from "./gemini";
import { getMessage, getMessagesByChatId } from "./messages";
import { getProfile } from "./profile";
import { getPrompt } from "./prompts";

export async function createFeedback(
  chatId: string,
  values: MessageFormValues,
) {
  const user = await getUser();

  const result = createMessageSchema.safeParse(values);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const chat = await getChat(chatId);

  if (!chat) {
    return { error: "チャットが見つかりません。" };
  }

  const healthLogs = await getHealthLogsByDateRange(
    result.data.startDate,
    result.data.endDate,
  );

  const messages = await getMessagesByChatId(chatId);

  const history = messages.map((message) => ({
    userText: message.content,
    modelText: message.feedbacks[0]?.content ?? "",
  }));

  const profile = await getProfile();

  const generateResult = await geminiGenerateContent(
    prompt.content,
    history,
    result.data.content,
    result.data.useGoogleSearch,
    healthLogs,
    profile,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  await prisma.$transaction(async (tx) => {
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
    await tx.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });
  });

  revalidatePath("/chats");
  return { success: true, chatId };
}

export async function getFeedback(id: string) {
  const user = await getUser();

  const feedback = await prisma.feedback.findFirst({
    where: { id, userId: user.id },
  });

  return feedback;
}

export async function updateFeedback(
  feedbackId: string,
  values: MessageFormValues,
) {
  const result = updateMessageSchema.safeParse({ ...values, feedbackId });

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const feedback = await getFeedback(result.data.feedbackId);

  if (!feedback) {
    return { error: "AI回答が見つかりません。" };
  }

  const healthLogs = await getHealthLogsByDateRange(
    result.data.startDate,
    result.data.endDate,
  );

  const profile = await getProfile();

  if (!profile) {
    return { error: "プロフィールが見つかりません。" };
  }

  const message = await getMessage(feedback.messageId);

  if (!message) {
    return { error: "メッセージが見つかりません。" };
  }

  const chat = await getChat(message.chatId);

  if (!chat) {
    return { error: "チャットが見つかりません。" };
  }

  const messages = await getMessagesByChatId(chat.id);

  const history = messages
    .filter((item) => item.id !== message.id)
    .map((item) => ({
      userText: item.content,
      modelText: item.feedbacks[0]?.content ?? "",
    }));

  const generateResult = await geminiGenerateContent(
    prompt.content,
    history,
    result.data.content,
    result.data.useGoogleSearch,
    healthLogs,
    profile,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  await prisma.$transaction(async (tx) => {
    const message = await tx.message.update({
      where: { id: feedback.messageId },
      data: {
        content: result.data.content,
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
        promptId: prompt.id,
      },
    });

    await tx.feedback.update({
      where: { id: feedback.id },
      data: {
        content: generateResult.content,
        promptSnapshot: prompt.content,
      },
    });

    await tx.chat.update({
      where: { id: message.chatId },
      data: {
        updatedAt: new Date(),
      },
    });
  });

  revalidatePath("/chats");
  return { success: true, chatId: message.chatId };
}
