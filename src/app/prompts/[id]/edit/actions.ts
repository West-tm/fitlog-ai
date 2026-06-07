"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FormSchema, FormValues } from "./schema";
import { revalidatePath } from "next/cache";

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

export async function updatePrompt(value: FormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const result = FormSchema.safeParse(value);

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
