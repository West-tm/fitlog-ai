import { notFound, redirect } from "next/navigation";

import { getFeedback, updateFeedback } from "@/app/actions/feedbacks";
import { getMessage } from "@/app/actions/messages";
import { getPrompts } from "@/app/actions/prompts";
import MessageForm from "@/components/messages/message-form";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export default async function EditFeedbackPage({
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

  const prompts = await getPrompts();
  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  const updateFeedbackAction = updateFeedback.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">AI回答を編集</h1>
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
