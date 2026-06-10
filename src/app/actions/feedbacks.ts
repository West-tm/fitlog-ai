"use server";

import { genai } from "@/lib/gemini/gemini";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { CreateNoteSchema, CreateNoteValues } from "@/lib/validations/notes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function generateFeedback(value: CreateNoteValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const result = CreateNoteSchema.safeParse(value);

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
