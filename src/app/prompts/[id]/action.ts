"use server";

import { prisma } from "@/lib/prisma/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deletePrompt(id: string) {
  await prisma.prompt.delete({ where: { id } });

  revalidatePath("/prompts");
  redirect("/prompts");
}
