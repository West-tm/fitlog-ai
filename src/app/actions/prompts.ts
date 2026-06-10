"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPromptSchema,
  CreatePromptValues,
  updatePromptSchema,
  UpdatePromptValues,
} from "@/lib/validations/prompts";

export async function createPrompt(value: CreatePromptValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const result = createPromptSchema.safeParse(value);

  if (!result.success) {
    throw new Error("入力内容を確認してください。");
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const prompt = await prisma.prompt.findUnique({
    where: { id, authorId: user.id },
  });

  if (!prompt) {
    throw new Error("指示文が見つかりません");
  }

  return prompt;
}

export async function updatePrompt(value: UpdatePromptValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const result = updatePromptSchema.safeParse(value);

  if (!result.success) {
    throw new Error("入力内容を確認してください。");
  }

  const updateResult = await prisma.prompt.updateMany({
    where: { id: result.data.id, authorId: user.id },
    data: {
      content: result.data.content,
    },
  });

  if (updateResult.count === 0) {
    throw new Error("更新対象の指示文が見つかりません。");
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}

export async function deletePrompt(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  try {
    const result = await prisma.prompt.deleteMany({
      where: { id, authorId: user.id },
    });

    if (result.count === 0) {
      return {
        error: "削除対象の指示文が見つかりません。",
      };
    }
  } catch (error) {
    console.error("削除に失敗しました:", error);

    return {
      error: "削除に失敗しました。もう一度お試しください。",
    };
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}
