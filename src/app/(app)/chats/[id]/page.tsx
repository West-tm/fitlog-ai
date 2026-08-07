import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getChat } from "@/app/actions/chats";
import { getMessagesByChatId } from "@/app/actions/messages";
import PromptCollapsibleForChat from "@/components/prompts/prompt-collapsible-for-chat";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";

export default async function ChatPage({ params }: PageProps<"/chats/[id]">) {
  const { id } = await params;
  const chat = await getChat(id);

  if (!chat) {
    notFound();
  }

  const messages = await getMessagesByChatId(id);

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
                <MessageFooter>
                  送信日時:{" "}
                  {message.createdAt.toLocaleString("ja-JP", {
                    timeZone: "Asia/Tokyo",
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
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
    </div>
  );
}
