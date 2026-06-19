import { getPrompts } from "@/app/actions/prompts";
import NewNoteForm from "@/components/notes/new-note-form";

export default async function CreateFeedbackPage() {
  const prompts = await getPrompts();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">フィードバックの新規作成</h1>
      <NewNoteForm prompts={prompts} />
    </div>
  );
}
