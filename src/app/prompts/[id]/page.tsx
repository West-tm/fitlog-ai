import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function PromptPage(
  promptPageProps: PageProps<"/prompts/[id]">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { id } = await promptPageProps.params;
  const prompt = await prisma.prompt.findUnique({
    where: { id, authorId: user.id },
  });

  if (!prompt) {
    notFound();
  }

  return (
    <>
      <p>指示文の詳細</p>
      <div className="flex gap-3 mt-5">
        <div className="w-1/8">指示文</div>
        <div>作成日時</div>
      </div>

      <div className="flex gap-3" key={prompt.id}>
        <div className="w-1/8">{prompt.content}</div>
        <div>{prompt.createdAt.toLocaleString()}</div>
        <Link href={`/prompts/${prompt.id}/edit`}>編集</Link>
        <button>削除</button>
      </div>
    </>
  );
}
