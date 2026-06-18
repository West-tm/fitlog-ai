import { Feedback } from "@prisma/client";
import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import { getNote } from "@/app/actions/notes";
import { getPrompt, getPrompts } from "@/app/actions/prompts";
import EditNoteFrom from "@/components/notes/edit-note-form";

const setPrompt = async (feedback: Feedback) => {
  if (feedback.promptId) {
    const prompt = await getPrompt(feedback.promptId);
    if (prompt) {
      return prompt;
    }
  }
  return {
    id: "",
    content: feedback.promptSnapshot,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
    title: "削除済みの指示文",
  };
};

export default async function EditFeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;
  const feedback = await getFeedback(id);

  if (!feedback) {
    notFound();
  }

  const prompt = await setPrompt(feedback);

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

      <h1 className="text-xl font-semibold">フィードバックの詳細</h1>

      <dl className="space-y-4">
        <div className="space-y-1">
          <dt className="text-muted-foreground">フィードバック</dt>
          <dd className="wrap-anywhere">{feedback.content}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-muted-foreground">作成日時</dt>
          <dd>
            {feedback.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </dd>
        </div>
      </dl>
    </div>
  );
}
