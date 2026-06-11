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
    <>
      <div>フィードバック詳細</div>
      <br />

      <div>フィードバック：{feedback.content}</div>
      <div>
        作成日時：
        {feedback.createdAt.toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
        })}
      </div>

      <DeleteFeedbackButton id={id} />
    </>
  );
}
