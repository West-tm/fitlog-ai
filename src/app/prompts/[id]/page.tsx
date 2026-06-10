import DeletePromptButton from "@/components/prompts/delete-prompt-button";
import { prisma } from "@/lib/prisma/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

export default async function PromptPage({
  params,
}: PageProps<"/prompts/[id]">) {
  const user = await getUser();

  const { id } = await params;
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
        <DeletePromptButton id={id} />
      </div>
    </>
  );
}
