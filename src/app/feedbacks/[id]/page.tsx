import DeleteFeedbackButton from "@/components/feedbacks/delete-feedback-button";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function FeedbackPage(
  Props: PageProps<"/feedbacks/[id]">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { id } = await Props.params;
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
