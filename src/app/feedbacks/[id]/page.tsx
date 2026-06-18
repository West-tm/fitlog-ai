import { Feedback } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import { getNote } from "@/app/actions/notes";
import { getPrompt } from "@/app/actions/prompts";
import DeleteNoteButton from "@/components/notes/delete-note-button";
import { Button } from "@/components/ui/button";

const setPrompt = async (feedback: Feedback) => {
  if (feedback.promptId) {
    const prompt = await getPrompt(feedback.promptId);
    if (prompt) {
      return {
        title: prompt.title,
        content: prompt.content,
      };
    }
  }
  return {
    title: "削除済みの指示文",
    content: feedback.promptSnapshot,
  };
};

export default async function FeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;

  const feedback = await getFeedback(id);
  if (!feedback) {
    notFound();
  }

  const note = await getNote(feedback.noteId);
  if (!note) {
    notFound();
  }

  const { title, content } = await setPrompt(feedback);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">ノートの詳細</h1>

        <dl className="space-y-1">
          <div className="space-y-1">
            <dt className="text-muted-foreground">タイトル</dt>
            <dd className="wrap-anywhere">{title}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-muted-foreground">指示文</dt>
            <dd className="wrap-anywhere">{content}</dd>
          </div>

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
            <Link href={`/feedbacks/${feedback.id}/edit`}>編集</Link>
          </Button>
          <DeleteNoteButton id={note.id} />
        </div>
      </div>

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
