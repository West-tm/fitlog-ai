import DeleteNoteButton from "@/components/notes/delete-note-button";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function NotePage({ params }: PageProps<"/notes/[id]">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

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
