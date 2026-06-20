import { redirect } from "next/navigation";

import { generateFeedback } from "@/app/actions/feedbacks";
import { getPrompts } from "@/app/actions/prompts";
import MessageForm from "@/components/messages/message-form";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export default async function CreateFeedbackPage() {
  const prompts = await getPrompts();

  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">AI回答を作成</h1>
      <MessageForm prompts={prompts} onSubmitAction={generateFeedback} />
    </div>
  );
}
