import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNote } from "./actions";
import EditNoteFrom from "@/components/notes/edit-note-form";

export default async function EditNotePage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { id } = await params;
  const note = await getNote(id);

  return (
    <>
      <div>ノートの編集</div>
      <EditNoteFrom note={note} />
    </>
  );
}
