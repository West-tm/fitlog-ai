import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFeedbacksByPromptId } from "@/app/actions/feedbacks";
import { getPromptWithFeedbackCount } from "@/app/actions/prompts";
import DeletePromptButton from "@/components/prompts/delete-prompt-button";
import PromptContentCollapsible from "@/components/prompts/prompt-content-collapsible";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PromptPage({
  params,
}: PageProps<"/prompts/[id]">) {
  const { id } = await params;
  const prompt = await getPromptWithFeedbackCount(id);

  if (!prompt) {
    notFound();
  }

  const feedbacks = await getFeedbacksByPromptId(id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">指示文の詳細</h1>

      <Card>
        <CardHeader>
          <CardTitle>指示文</CardTitle>
          <CardDescription>
            指示文の詳細確認・編集・削除が行えます。
          </CardDescription>
          <CardAction className="space-x-2">
            <Button asChild>
              <Link href={`/prompts/${prompt.id}/edit`}>
                <Pencil />
                編集
              </Link>
            </Button>
            <DeletePromptButton id={id} />
          </CardAction>
        </CardHeader>
        <Separator />

        <CardContent>
          <dl className="space-y-4">
            <div className="space-y-1">
              <dt className="text-muted-foreground">タイトル</dt>
              <dd className="wrap-anywhere">{prompt.title}</dd>
            </div>
            <Separator />

            <div className="flex gap-4">
              <div className="space-y-1">
                <dt className="w-14 text-muted-foreground">利用回数</dt>
                <dd>{prompt._count.feedbacks} 回</dd>
              </div>
              <Separator orientation="vertical" />

              <div className="space-y-1">
                <dt className="text-muted-foreground">更新日時</dt>
                <dd>
                  {prompt.updatedAt.toLocaleString("ja-JP", {
                    timeZone: "Asia/Tokyo",
                  })}
                </dd>
              </div>
              <Separator orientation="vertical" />

              <div className="space-y-1">
                <dt className="text-muted-foreground">作成日時</dt>
                <dd>
                  {prompt.createdAt.toLocaleString("ja-JP", {
                    timeZone: "Asia/Tokyo",
                  })}
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <PromptContentCollapsible
            promptContent={prompt.content}
            isOpen={true}
          />
        </CardFooter>
      </Card>

      <h2 className="text-lg font-semibold">この指示文で作成したAI回答</h2>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>AI回答</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">更新日</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">作成日</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id} className="max-h-1">
              <TableCell className="w-44 max-w-44 overflow-hidden">
                <Link
                  href={`/feedbacks/${feedback.id}`}
                  className="block truncate hover:underline"
                >
                  {feedback.content}
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {feedback.updatedAt.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {feedback.createdAt.toLocaleDateString("ja-JP", {
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
