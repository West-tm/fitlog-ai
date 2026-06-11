"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getUser } from "@/lib/auth/get-user";
import { genai } from "@/lib/gemini/gemini";
import { prisma } from "@/lib/prisma/prisma";
import { createNoteSchema, CreateNoteValues } from "@/lib/validations/notes";

export async function generateFeedback(value: CreateNoteValues) {
  const user = await getUser();

  const result = createNoteSchema.safeParse(value);

  if (!result.success) {
    return { error: "入力内容を確認してください。" };
  }

  const prompt = await prisma.prompt.findFirst({
    where: {
      id: result.data.promptId,
      authorId: user.id,
    },
  });

  if (!prompt) {
    return { error: "指示文が見つかりません。" };
  }

  const config = result.data.useGoogleSearch
    ? { tools: [{ googleSearch: {} }] }
    : undefined;

  try {
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
  } catch (error) {
    console.error(error);

    return {
      error: "AI生成に失敗しました。しばらくしてから再度お試しください。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}

export async function deleteFeedback(id: string) {
  const parseId = z.uuid().safeParse(id);
  if (!parseId.success) {
    return {
      error: "不正なフィードバックIDです。",
    };
  }

  const user = await getUser();

  try {
    const result = await prisma.feedback.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      return {
        error: "削除対象のフィードバックが見つかりません。",
      };
    }
  } catch (error) {
    console.error("削除に失敗しました:", error);

    return {
      error: "削除に失敗しました。もう一度お試しください。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}
