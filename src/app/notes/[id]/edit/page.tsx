import EditNoteFrom from "@/components/notes/edit-note-form";
import { getNote } from "@/app/actions/notes";
import { getUser } from "@/lib/auth/get-user";

export default async function EditNotePage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  await getUser();

  const { id } = await params;
  const note = await getNote(id);

  return (
    <>
      <div>ノートの編集</div>
      <EditNoteFrom note={note} />
    </>
  );
}
