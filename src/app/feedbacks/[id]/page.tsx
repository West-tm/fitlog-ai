import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import DeleteFeedbackButton from "@/components/feedbacks/delete-feedback-button";

export default async function FeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;

  const feedback = await getFeedback(id);

  if (!feedback) {
    notFound();
  }

  return (
    <div className="space-y-6">
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

      <DeleteFeedbackButton id={id} />
    </div>
  );
}
