import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import { getMessage } from "@/app/actions/messages";
import { getPrompt } from "@/app/actions/prompts";
import DeleteMessageButton from "@/components/messages/delete-message-button";
import PromptContentCollapsible from "@/components/prompts/prompt-content-collapsible";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function FeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;

  const feedback = await getFeedback(id);
  if (!feedback) {
    notFound();
  }

  const message = await getMessage(feedback.messageId);
  if (!message) {
    notFound();
  }

  const promptTitle =
    (feedback.promptId && (await getPrompt(feedback.promptId))?.title) ??
    "削除済みの指示文";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">AI回答の詳細</h1>

      <Card>
        <CardHeader>
          <CardTitle>AI回答</CardTitle>
          <CardDescription>
            AI回答の確認・編集・削除が行えます。
          </CardDescription>

          <CardAction className="space-x-2">
            <Button asChild>
              <Link href={`/feedbacks/${feedback.id}/edit`}>
                <Pencil /> 編集
              </Link>
            </Button>
            <DeleteMessageButton id={message.id} />
          </CardAction>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <section className="space-y-2 rounded-md bg-muted p-3">
            <h2 className="text-base font-semibold text-muted-foreground">
              入力内容
            </h2>

            <Separator />

            <div className="space-y-1">
              <p className="text-muted-foreground">指示文</p>
              <p className="wrap-anywhere">{promptTitle}</p>
            </div>

            <PromptContentCollapsible
              promptContent={feedback.promptSnapshot}
              isOpen={false}
            />

            <Separator />

            <div className="space-y-1">
              <p className="text-muted-foreground">メッセージ</p>
              <p className="wrap-anywhere">{message.content}</p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-muted-foreground">
              AI回答
            </h2>

            <Separator />

            <p className="leading-7 wrap-anywhere whitespace-pre-wrap">
              {feedback.content}
            </p>
          </section>

          <Separator />

          <section className="flex gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground">更新日時</p>
              <p>
                {feedback.updatedAt.toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </p>
            </div>

            <Separator orientation="vertical" />

            <div className="space-y-1">
              <p className="text-muted-foreground">作成日時</p>
              <p>
                {feedback.createdAt.toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
