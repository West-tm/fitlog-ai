"use server";

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

  await prisma.prompt.create({
    data: {
      content: result.data.content,
      authorId: user.id,
    },
  });

  revalidatePath("/prompts");
  redirect("/prompts");
}

export async function getPrompt(id: string) {
  const user = await getUser();

  const prompt = await prisma.prompt.findFirst({
    where: { id, authorId: user.id },
  });

  return prompt;
}

export async function updatePrompt(value: UpdatePromptValues) {
  const user = await getUser();

  const result = updatePromptSchema.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const updateResult = await prisma.prompt.updateMany({
    where: { id: result.data.id, authorId: user.id },
    data: {
      content: result.data.content,
    },
  });

  if (updateResult.count === 0) {
    return { error: "更新対象の指示文が見つかりません。" };
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}

export async function deletePrompt(id: string) {
  const user = await getUser();

  const result = await prisma.prompt.deleteMany({
    where: { id, authorId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象の指示文が見つかりません。",
    };
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}
