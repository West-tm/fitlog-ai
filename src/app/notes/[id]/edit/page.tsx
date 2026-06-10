import EditNoteFrom from "@/components/notes/edit-note-form";
import { getNote } from "@/app/actions/notes";

export default async function EditNotePage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  const { id } = await params;
  const note = await getNote(id);

  return (
    <>
      <div>ノートの編集</div>
      <EditNoteFrom note={note} />
    </>
  );
}
