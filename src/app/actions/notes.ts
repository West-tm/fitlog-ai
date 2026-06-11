"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import { updateNoteSchema, UpdateNoteValues } from "@/lib/validations/notes";

export async function getNote(id: string) {
  const user = await getUser();

  const note = await prisma.note.findFirst({
    where: { id, authorId: user.id },
  });

  return note;
}

export async function updateNote(value: UpdateNoteValues) {
  const user = await getUser();

  const result = updateNoteSchema.safeParse(value);

  if (!result.success) {
    return {
      error: "入力内容を確認してください。",
    };
  }

  const updateResult = await prisma.note.updateMany({
    where: { id: result.data.id, authorId: user.id },
    data: {
      content: result.data.content,
    },
  });

  if (updateResult.count === 0) {
    return {
      error: "更新対象のノートが見つかりません。",
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  const user = await getUser();

  const result = await prisma.note.deleteMany({
    where: { id, authorId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象のノートが見つかりません。",
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}
