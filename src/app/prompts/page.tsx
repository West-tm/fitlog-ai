import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PromptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const prompts = await prisma.prompt.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Link className="bg-blue-200" href={"/prompts/new"}>
        + 新規作成
      </Link>

      <p>指示文の一覧</p>
      <div className="flex gap-3 mt-5">
        <div className="w-1/8">指示文</div>
        <div>作成日時</div>
      </div>
      {prompts.map((prompt) => (
        <div className="flex gap-3" key={prompt.id}>
          <div className="w-1/8">{prompt.content}</div>
          <div>
            {prompt.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </div>
          <Link href={`/prompts/${prompt.id}`}>詳細</Link>
        </div>
      ))}
    </>
  );
}
