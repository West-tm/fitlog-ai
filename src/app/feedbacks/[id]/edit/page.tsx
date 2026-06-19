import { notFound } from "next/navigation";

import { getFeedback } from "@/app/actions/feedbacks";
import { getMessage } from "@/app/actions/messages";
import { getPromptbyFeedback, getPrompts } from "@/app/actions/prompts";
import EditMessageFrom from "@/components/messages/edit-message-form";

export default async function EditFeedbackPage({
  params,
}: PageProps<"/feedbacks/[id]">) {
  const { id } = await params;
  const feedback = await getFeedback(id);

  if (!feedback) {
    notFound();
  }

  const prompt = await getPromptbyFeedback(feedback);

  const message = await getMessage(feedback.messageId);
  if (!message) {
    notFound();
  }

  const prompts = await getPrompts();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">フィードバックの編集</h1>
      <EditMessageFrom
        prompts={prompts}
        prompt={prompt}
        message={message}
        feedback={feedback}
      />
    </div>
  );
}
