"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import {
  createPromptSchema,
  PromptFormValues,
  updatePromptSchema,
} from "@/lib/validations/prompts";

export async function createPrompt(values: PromptFormValues) {
  const user = await getUser();

  const result = createPromptSchema.safeParse(values);

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
  });

  return prompt;
}

export async function getPromptWithMessages(id: string) {
  const user = await getUser();

  const prompt = await prisma.prompt.findFirst({
    where: { id, userId: user.id },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
      messages: {
        include: {
          chat: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  return prompt;
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
  });

  return prompts;
}

export async function getPromptsWithMessageCount() {
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
          messages: true,
        },
      },
    },
  });

  return prompts;
}

export async function updatePrompt(id: string, values: PromptFormValues) {
  const user = await getUser();

  const result = updatePromptSchema.safeParse({ ...values, id });

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
  redirect("/prompts");
}
