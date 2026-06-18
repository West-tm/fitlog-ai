"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import { createNoteSchema, CreateNoteValues } from "@/lib/validations/notes";

import { geminiGenerateContent } from "./gemini";
import { getPrompt } from "./prompts";

export async function generateFeedback(value: CreateNoteValues) {
  const user = await getUser();

  const result = createNoteSchema.safeParse(value);

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

  await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        content: result.data.content,
        userId: user.id,
      },
    });
    await tx.feedback.create({
      data: {
        userId: user.id,
        noteId: note.id,
        promptId: prompt.id,
        promptSnapshot: prompt.content,
        content: generateResult.content,
      },
    });
  });

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}

export async function getFeedback(id: string) {
  const user = await getUser();

  const feedback = await prisma.feedback.findFirst({
    where: { id, userId: user.id },
  });

  return feedback;
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
