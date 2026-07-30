"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import {
  createMessageSchema,
  MessageFormValues,
  updateMessageSchema,
} from "@/lib/validations/messages";

import { getBodyLogsByStartDateAndEndDate } from "./body-logs";
import { geminiGenerateContent } from "./gemini";
import { getPrompt } from "./prompts";

export async function generateFeedback(values: MessageFormValues) {
  const user = await getUser();

  const result = createMessageSchema.safeParse(values);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
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

  const feedback = await prisma.$transaction(async (tx) => {
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
    const feedback = await tx.feedback.create({
      data: {
        content: generateResult.content,
        promptSnapshot: prompt.content,
        userId: user.id,
        messageId: message.id,
      },
    });

    return feedback;
  });

  revalidatePath("/feedbacks");
  redirect(`/feedbacks/${feedback.id}`);
}

export async function getFeedback(id: string) {
  const user = await getUser();

  const feedback = await prisma.feedback.findFirst({
    where: { id, userId: user.id },
  });

  return feedback;
}

export async function getFeedbacks() {
  const user = await getUser();

  const feedbacks = await prisma.feedback.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return feedbacks;
}

export async function getFeedbacksByPromptId(promptId: string) {
  const user = await getUser();

  const feedbacks = await prisma.feedback.findMany({
    where: {
      userId: user.id,
      message: {
        promptId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return feedbacks;
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

  await prisma.$transaction(async (tx) => {
    await tx.message.update({
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
  });

  revalidatePath("/feedbacks");
  redirect(`/feedbacks/${feedback.id}`);
}

export async function deleteFeedback(id: string) {
  const user = await getUser();

  const result = await prisma.feedback.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象のAI回答が見つかりません。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}
