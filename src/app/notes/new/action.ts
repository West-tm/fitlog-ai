"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FormSchema, FormValues } from "./schema";
import { revalidatePath } from "next/cache";

export default async function createNote(value: FormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const result = FormSchema.safeParse(value);

  if (!result.success) {
    throw new Error("入力内容を確認してください。");
  }

  await prisma.note.create({
    data: {
      content: result.data.content,
      authorId: user.id,
    },
  });

  revalidatePath("/notes");
  redirect("/notes");
}
