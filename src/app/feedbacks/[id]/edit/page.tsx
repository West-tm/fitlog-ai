import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import { getNote } from "@/app/actions/notes";
import { getPromptbyFeedback, getPrompts } from "@/app/actions/prompts";
import EditNoteFrom from "@/components/notes/edit-note-form";

export default async function EditFeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;
  const feedback = await getFeedback(id);

  if (!feedback) {
    notFound();
  }

  const prompt = await getPromptbyFeedback(feedback);

  const note = await getNote(feedback.noteId);
  if (!note) {
    notFound();
  }

  const prompts = await getPrompts();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">フィードバックの再生成</h1>
      <EditNoteFrom
        prompts={prompts}
        prompt={prompt}
        note={note}
        feedback={feedback}
      />
    </div>
  );
}
