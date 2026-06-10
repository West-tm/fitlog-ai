"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createPromptSchema,
  CreatePromptValues,
} from "@/lib/validations/prompts";

export default async function createPrompt(value: CreatePromptValues) {
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
