import { getUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma/prisma";
import Link from "next/link";

export default async function FeedbacksPage() {
  const user = await getUser();

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
