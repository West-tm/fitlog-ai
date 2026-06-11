"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { genai } from "@/lib/gemini/gemini";
import { prisma } from "@/lib/prisma/prisma";
import { createNoteSchema, CreateNoteValues } from "@/lib/validations/notes";

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

  const config = result.data.useGoogleSearch
    ? { tools: [{ googleSearch: {} }] }
    : undefined;

  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    #指示
    ${prompt.content}
    #ノート
    ${result.data.content}
    `.trim(),
    config,
  });

  const feedbackContent = response.text?.trim();

  if (!feedbackContent) {
    return { error: "AIから回答を取得できませんでした。" };
  }

  await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        content: result.data.content,
        authorId: user.id,
      },
    });
    await tx.feedback.create({
      data: {
        userId: user.id,
        noteId: note.id,
        promptId: prompt.id,
        content: feedbackContent,
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
