import NewNoteForm from "@/components/notes/new-note-form";
import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

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
