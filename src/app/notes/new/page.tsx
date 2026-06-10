import NewNoteForm from "@/components/notes/new-note-form";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewNotePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const prompts = await prisma.prompt.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div>ノートの新規作成</div>
      <NewNoteForm prompts={prompts} />
    </>
  );
}
