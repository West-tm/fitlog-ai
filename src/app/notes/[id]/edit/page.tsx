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
    <>
      <div>ノートの編集</div>
      <EditNoteFrom note={note} />
    </>
  );
}
