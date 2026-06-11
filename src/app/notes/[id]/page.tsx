import Link from "next/link";
import { notFound } from "next/navigation";

import { getNote } from "@/app/actions/notes";
import DeleteNoteButton from "@/components/notes/delete-note-button";

export default async function NotePage({ params }: PageProps<"/notes/[id]">) {
  const { id } = await params;
  const note = await getNote(id);

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
