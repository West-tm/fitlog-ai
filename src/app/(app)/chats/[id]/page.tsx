import { PencilIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getChat } from "@/app/actions/chats";
import { createFeedback, updateFeedback } from "@/app/actions/feedbacks";
import { getMessagesByChatId } from "@/app/actions/messages";
import { getPrompts } from "@/app/actions/prompts";
import CopyButton from "@/components/button/copy-button";
import MessageForm from "@/components/messages/message-form";
import PromptCollapsibleForChat from "@/components/prompts/prompt-collapsible-for-chat";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { formatTokyoDateLabel, toTokyoDateString } from "@/lib/date";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export async function generateMetadata({
  params,
}: PageProps<"/chats/[id]">): Promise<Metadata> {
  const { id } = await params;
  const chat = await getChat(id);

  return {
    title: chat?.title || "チャット",
  };
}

export default async function ChatPage({
  params,
  searchParams,
}: PageProps<"/chats/[id]">) {
  const { id } = await params;
  const { editing } = await searchParams;
  const editingId = typeof editing === "string" ? editing : null;

  const chat = await getChat(id);

  if (!chat) notFound();

  const prompts = await getPrompts();
  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  const messages = await getMessagesByChatId(id);

  const lastMessage = messages.at(-1);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{chat.title}</h1>

      <div className="mb-12 space-y-2">
        {messages.map((message) => {
          const feedback = message.feedbacks[0];

          return (
            <div className="space-y-4" key={message.id}>
              {feedback && editingId === message.id ? (
                <div className="mt-4 space-y-2">
                  <MessageForm
                    prompts={prompts}
                    onSubmitAction={updateFeedback.bind(null, feedback.id)}
                    defaultValues={{
                      content: message.content,
                      promptId: message.promptId ?? "",
                      useGoogleSearch: false,
                      startDate: toTokyoDateString(message.startDate),
                      endDate: toTokyoDateString(message.endDate),
                    }}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    title="キャンセル"
                    asChild
                  >
                    <Link
                      href={`/chats/${id}`}
                      className="w-full"
                      scroll={false}
                    >
                      キャンセル
                    </Link>
                  </Button>
                </div>
              ) : (
                <Message align="end">
                  <MessageContent>
                    <MessageHeader className="flex-col items-end gap-2">
                      {message.prompt && (
                        <PromptCollapsibleForChat
                          promptTitle={message.prompt.title}
                          promptContent={message.prompt.content}
                          isOpen={false}
                        />
                      )}
                      <span>
                        使用データ期間:{" "}
                        {`${formatTokyoDateLabel(message.startDate)} ~ ${formatTokyoDateLabel(message.endDate)}`}
                      </span>
                    </MessageHeader>

                    <Bubble>
                      <BubbleContent>{message.content}</BubbleContent>
                    </Bubble>
                    <MessageFooter className="flex items-center gap-4">
                      <span>
                        更新日: {formatTokyoDateLabel(message.updatedAt)}
                      </span>
                      {feedback && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="メッセージを編集する"
                          asChild
                        >
                          <Link
                            href={`/chats/${id}?editing=${message.id}`}
                            scroll={false}
                            aria-label="メッセージを編集する"
                          >
                            <PencilIcon className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      )}
                    </MessageFooter>
                  </MessageContent>
                </Message>
              )}

              {feedback?.content ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {feedback.content}
                  </ReactMarkdown>
                  <CopyButton copyText={feedback.content} />
                </div>
              ) : (
                <p>回答なし</p>
              )}
            </div>
          );
        })}
      </div>

      {editingId === null && (
        <MessageForm
          prompts={prompts}
          onSubmitAction={createFeedback.bind(null, id)}
          defaultValues={{
            content: "",
            promptId: lastMessage?.promptId ?? "",
            useGoogleSearch: false,
            startDate: lastMessage
              ? toTokyoDateString(lastMessage.startDate)
              : toTokyoDateString(),
            endDate: lastMessage
              ? toTokyoDateString(lastMessage.endDate)
              : toTokyoDateString(),
          }}
        />
      )}
    </div>
  );
}
