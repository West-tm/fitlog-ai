"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import {
  createMessageSchema,
  CreateMessageValues,
  UpdateMessageSchema,
  updateMessageValues,
} from "@/lib/validations/messages";

import { geminiGenerateContent } from "./gemini";
import { getPrompt } from "./prompts";

export async function generateFeedback(value: CreateMessageValues) {
  const user = await getUser();

  const result = createMessageSchema.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const generateResult = await geminiGenerateContent(
    prompt.content,
    result.data.content,
    result.data.useGoogleSearch,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  const feedback = await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        content: result.data.content,
        userId: user.id,
      },
    });
    const feedback = await tx.feedback.create({
      data: {
        userId: user.id,
        messageId: message.id,
        promptId: prompt.id,
        promptSnapshot: prompt.content,
        content: generateResult.content,
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
      promptId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return feedbacks;
}

export async function updateFeedback(value: UpdateMessageSchema) {
  const result = updateMessageValues.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await getPrompt(result.data.promptId);

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const feedback = await getFeedback(result.data.feedbackId);

  if (!feedback) {
    return { error: "フィードバックが見つかりません。" };
  }

  const generateResult = await geminiGenerateContent(
    prompt.content,
    result.data.content,
    result.data.useGoogleSearch,
  );

  if (!generateResult.ok) {
    return { error: generateResult.error };
  }

  await prisma.$transaction(async (tx) => {
    await tx.message.update({
      where: { id: feedback.messageId },
      data: {
        content: result.data.content,
      },
    });

    await tx.feedback.update({
      where: { id: feedback.id },
      data: {
        promptId: prompt.id,
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
      error: "削除対象のフィードバックが見つかりません。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}
