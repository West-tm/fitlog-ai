"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export async function getNote(id: string) {
  const user = await getUser();

  const note = await prisma.note.findFirst({
    where: { id, userId: user.id },
  });

  return note;
}

export async function deleteNote(id: string) {
  const user = await getUser();

  const result = await prisma.note.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return {
      error: "削除対象のノートが見つかりません。",
    };
  }

  revalidatePath("/feedbacks");
  redirect("/feedbacks");
}
