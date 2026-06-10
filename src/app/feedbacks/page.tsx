import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FeedbacksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const feedbacks = await prisma.feedback.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div>フィードバックの一覧</div>
      <br />
      {feedbacks.map((feedback) => (
        <div
          className="grid grid-cols-[1fr_180px_60px] gap-3 mb-5"
          key={feedback.id}
        >
          <div>フィードバック：{feedback.content}</div>
          <div>
            作成日時：
            {feedback.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </div>
          <Link href={`/feedbacks/${feedback.id}`}>詳細</Link>
        </div>
      ))}
    </>
  );
}
