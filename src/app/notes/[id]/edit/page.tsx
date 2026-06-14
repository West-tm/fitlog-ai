import { notFound } from "next/navigation";

import { getNote } from "@/app/actions/notes";
import EditNoteFrom from "@/components/notes/edit-note-form";

export default async function EditNotePage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">ノートの編集</h1>
      <EditNoteFrom note={note} />
    </div>
  );
}
