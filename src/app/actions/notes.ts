"use server";

import { prisma } from "@/lib/prisma/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateNoteSchema, UpdateNoteValues } from "@/lib/validations/notes";
import { getUser } from "@/lib/auth/get-user";

export async function getNote(id: string) {
  const user = await getUser();

  const note = await prisma.note.findUnique({
    where: { id, authorId: user.id },
  });

  if (!note) {
    throw new Error("ノートが見つかりません");
  }

  return note;
}

export async function updateNote(value: UpdateNoteValues) {
  const user = await getUser();

  const result = updateNoteSchema.safeParse(value);

  if (!result.success) {
    throw new Error("入力内容を確認してください。");
  }

  const updateResult = await prisma.note.updateMany({
    where: { id: result.data.id, authorId: user.id },
    data: {
      content: result.data.content,
    },
  });

  if (updateResult.count === 0) {
    throw new Error("更新対象のノートが見つかりません。");
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  const user = await getUser();

  try {
    const result = await prisma.note.deleteMany({
      where: { id, authorId: user.id },
    });

    if (result.count === 0) {
      return {
        error: "削除対象のノートが見つかりません。",
      };
    }
  } catch (error) {
    console.error("削除に失敗しました:", error);

    return {
      error: "削除に失敗しました。もう一度お試しください。",
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}
