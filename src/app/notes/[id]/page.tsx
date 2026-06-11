import Link from "next/link";
import { notFound } from "next/navigation";

import DeleteNoteButton from "@/components/notes/delete-note-button";
import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export default async function NotePage({ params }: PageProps<"/notes/[id]">) {
  const user = await getUser();

  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id, authorId: user.id },
  });

  if (!note) {
    notFound();
  }

  return (
    <>
      <p>ノートの詳細</p>
      <div className="flex gap-3 mt-5">
        <div className="w-1/8">ノート</div>
        <div>作成日時</div>
      </div>

      <div className="flex gap-3" key={note.id}>
        <div className="w-1/8">{note.content}</div>
        <div>
          {note.createdAt.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })}
        </div>
        <Link href={`/notes/${note.id}/edit`}>編集</Link>
        <DeleteNoteButton id={id} />
      </div>
    </>
  );
}
