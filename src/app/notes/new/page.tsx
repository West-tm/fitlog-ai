import NewNoteForm from "@/components/notes/new-note-form";
import { prisma } from "@/lib/prisma/prisma";
import { getUser } from "@/lib/auth/get-user";

export default async function NewNotePage() {
  const user = await getUser();

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
