"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import {
  MessageFormValues,
  updateMessageSchema,
} from "@/lib/validations/messages";

import { getBodyLogsByStartDateAndEndDate } from "./body-logs";
import { geminiGenerateContent } from "./gemini";
import { getPrompt } from "./prompts";

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

  const bodyLogs = await getBodyLogsByStartDateAndEndDate(
    new Date(result.data.startDate),
    new Date(result.data.endDate),
  );

  const generateResult = await geminiGenerateContent(
    prompt.content,
    result.data.content,
    result.data.useGoogleSearch,
    bodyLogs,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  const message = await prisma.$transaction(async (tx) => {
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

    return message;
  });

  revalidatePath("/chats");
  redirect(`/chats/${message.chatId}`);
}
