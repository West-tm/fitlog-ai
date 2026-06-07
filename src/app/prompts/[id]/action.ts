"use server";

import { prisma } from "@/lib/prisma/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deletePrompt(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  try {
    const result = await prisma.prompt.deleteMany({
      where: { id, authorId: user.id },
    });

    if (result.count === 0) {
      return {
        error: "削除対象の指示文が見つかりません。",
      };
    }
  } catch (error) {
    console.error("削除に失敗しました:", error);

    return {
      error: "削除に失敗しました。もう一度お試しください。",
    };
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}
