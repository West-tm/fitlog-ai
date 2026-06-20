import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

import { getPromptsWithFeedbackCount } from "../actions/prompts";

type Props = {
  searchParams: Promise<{
    notice?: string | string[];
  }>;
};

export default async function PromptsPage({ searchParams }: Props) {
  const { notice } = await searchParams;
  const currentNotice = Array.isArray(notice) ? notice[0] : notice;
  const isPromptRequiredNotice = currentNotice === PROMPT_REQUIRED_NOTICE;

  const prompts = await getPromptsWithFeedbackCount();

  return (
    <div className="space-y-6">
      {isPromptRequiredNotice && (
        <div className="text-destructive">
          AI回答を作成・編集するには、先に指示文を作成してください。
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">指示文 一覧</h1>
        <Button asChild>
          <Link href="/prompts/new">
            <Plus /> 新規作成
          </Link>
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead className="w-24">利用回数</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">更新日</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">作成日</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell>
                <Link
                  href={`/prompts/${prompt.id}`}
                  className="block truncate hover:underline"
                >
                  {prompt.title}
                </Link>
              </TableCell>
              <TableCell
                className={
                  prompt._count.feedbacks ? "" : "text-muted-foreground"
                }
              >
                {prompt._count.feedbacks || "-"}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {prompt.updatedAt.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {prompt.createdAt.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
