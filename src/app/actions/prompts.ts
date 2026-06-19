"use server";

import { Feedback } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import {
  createPromptSchema,
  CreatePromptValues,
  updatePromptSchema,
  UpdatePromptValues,
} from "@/lib/validations/prompts";

export async function createPrompt(value: CreatePromptValues) {
  const user = await getUser();

  const result = createPromptSchema.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await prisma.prompt.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      userId: user.id,
    },
  });

  revalidatePath("/prompts");
  redirect(`/prompts/${prompt.id}`);
}

export async function getPrompt(id: string) {
  const user = await getUser();

  const prompt = await prisma.prompt.findFirst({
    where: { id, userId: user.id },
    include: {
      _count: {
        select: {
          feedbacks: true,
        },
      },
    },
  });

  return prompt;
}

export async function getPromptbyFeedback(feedback: Feedback) {
  if (feedback.promptId) {
    const prompt = await getPrompt(feedback.promptId);
    if (prompt) {
      return prompt;
    }
  }
  return {
    id: "",
    content: feedback.promptSnapshot,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
    title: "削除済みの指示文",
  };
}

export async function getPrompts() {
  const user = await getUser();

  const prompts = await prisma.prompt.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          feedbacks: true,
        },
      },
    },
  });

  return prompts;
}

export async function updatePrompt(value: UpdatePromptValues) {
  const user = await getUser();

  const result = updatePromptSchema.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const updateResult = await prisma.prompt.updateMany({
    where: { id: result.data.id, userId: user.id },
    data: {
      title: result.data.title,
      content: result.data.content,
    },
  });

  if (updateResult.count === 0) {
    return { error: "更新対象の指示文が見つかりません。" };
  }

  revalidatePath("/prompts");
  redirect(`/prompts/${result.data.id}`);
}

export async function deletePrompt(id: string) {
  const user = await getUser();

  const result = await prisma.prompt.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象の指示文が見つかりません。",
    };
  }

  revalidatePath("/prompts");
  revalidatePath("/feedbacks");
  redirect("/prompts");
}
