import Link from "next/link";
import { notFound } from "next/navigation";

import { getNote } from "@/app/actions/notes";
import DeleteNoteButton from "@/components/notes/delete-note-button";
import { Button } from "@/components/ui/button";

export default async function NotePage({ params }: PageProps<"/notes/[id]">) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">ノートの詳細</h1>

      <dl className="space-y-4">
        <div className="space-y-1">
          <dt className="text-muted-foreground">ノート</dt>
          <dd className="wrap-anywhere">{note.content}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-muted-foreground">作成日時</dt>
          <dd>
            {note.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </dd>
        </div>
      </dl>

      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/notes/${note.id}/edit`}>編集</Link>
        </Button>
        <DeleteNoteButton id={id} />
      </div>
    </div>
  );
}
