import { generateFeedback } from "@/app/actions/feedbacks";
import { getPrompts } from "@/app/actions/prompts";
import MessageForm from "@/components/messages/message-form";

export default async function CreateFeedbackPage() {
  const prompts = await getPrompts();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">フィードバックの新規作成</h1>
      <MessageForm prompts={prompts} onSubmitAction={generateFeedback} />
    </div>
  );
}
