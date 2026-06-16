import Link from "next/link";
import { notFound } from "next/navigation";

import { getPrompt } from "@/app/actions/prompts";
import DeletePromptButton from "@/components/prompts/delete-prompt-button";
import { Button } from "@/components/ui/button";

export default async function PromptPage({
  params,
}: PageProps<"/prompts/[id]">) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">指示文の詳細</h1>

      <dl className="space-y-4">
        <div className="space-y-1">
          <dt className="text-muted-foreground">タイトル</dt>
          <dd className="wrap-anywhere">{prompt.title}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-muted-foreground">指示文</dt>
          <dd className="wrap-anywhere">{prompt.content}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-muted-foreground">作成日時</dt>
          <dd>
            {prompt.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </dd>
        </div>
      </dl>

      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/prompts/${prompt.id}/edit`}>編集</Link>
        </Button>
        <DeletePromptButton id={id} />
      </div>
    </div>
  );
}
