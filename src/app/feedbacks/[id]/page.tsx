import { notFound } from "next/navigation";

import DeleteFeedbackButton from "@/components/feedbacks/delete-feedback-button";
import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";

export default async function FeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const user = await getUser();

  const { id } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: { id, userId: user.id },
  });

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
