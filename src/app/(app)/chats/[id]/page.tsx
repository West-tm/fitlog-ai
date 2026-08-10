import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getChat } from "@/app/actions/chats";
import { createFeedback } from "@/app/actions/feedbacks";
import { getMessagesByChatId } from "@/app/actions/messages";
import { getPrompts } from "@/app/actions/prompts";
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
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export default async function ChatPage({ params }: PageProps<"/chats/[id]">) {
  const { id } = await params;
  const chat = await getChat(id);

  if (!chat) {
    notFound();
  }

  const messages = await getMessagesByChatId(id);

  const prompts = await getPrompts();
  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  const createFeedbackAction = createFeedback.bind(null, id);

  const lastMessage = messages.at(-1);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{chat.title}</h1>
      <div className="space-y-2">
        {messages.map((message) => (
          <div className="space-y-4" key={message.id}>
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
                    {message.startDate.toLocaleDateString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                    })}
                    {" - "}
                    {message.endDate.toLocaleDateString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                    })}
                  </span>
                </MessageHeader>

                <Bubble>
                  <BubbleContent>{message.content}</BubbleContent>
                </Bubble>
                <MessageFooter className="flex items-center gap-4">
                  <span>
                    送信日時:{" "}
                    {message.createdAt.toLocaleString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </span>
                  <Button variant="ghost" size="icon" title="編集" asChild>
                    <Link href={`/chats/${message.chatId}/edit`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                </MessageFooter>
              </MessageContent>
            </Message>

            {message.feedbacks[0]?.content ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.feedbacks[0].content}
                </ReactMarkdown>
              </div>
            ) : (
              <p>回答なし</p>
            )}
          </div>
        ))}
      </div>

      <MessageForm
        prompts={prompts}
        onSubmitAction={createFeedbackAction}
        defaultValues={{
          content: "",
          promptId: lastMessage?.promptId ?? "",
          useGoogleSearch: false,
          startDate:
            lastMessage?.startDate.toISOString().slice(0, 10) ??
            new Date().toISOString().slice(0, 10),
          endDate:
            lastMessage?.endDate.toISOString().slice(0, 10) ??
            new Date().toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
