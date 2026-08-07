import { notFound, redirect } from "next/navigation";

import { updateFeedback } from "@/app/actions/feedbacks";
import { getMessageByChatId } from "@/app/actions/messages";
import { getPrompts } from "@/app/actions/prompts";
import MessageForm from "@/components/messages/message-form";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export default async function EditChatPage({
  params,
}: PageProps<"/chats/[id]/edit">) {
  const { id } = await params;

  const message = await getMessageByChatId(id);
  if (!message) {
    notFound();
  }

  const prompts = await getPrompts();
  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  const feedback = message.feedbacks[0];
  if (!feedback) {
    notFound();
  }
  const updateFeedbackAction = updateFeedback.bind(null, feedback.id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">チャットのメッセージを編集</h1>
      <MessageForm
        prompts={prompts}
        onSubmitAction={updateFeedbackAction}
        defaultValues={{
          content: message.content,
          promptId: message.promptId ?? "",
          useGoogleSearch: false,
          startDate: message.startDate.toISOString().slice(0, 10),
          endDate: message.endDate.toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
