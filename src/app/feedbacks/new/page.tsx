import { getPrompts } from "@/app/actions/prompts";
import NewMessageForm from "@/components/messages/new-message-form";

export default async function CreateFeedbackPage() {
  const prompts = await getPrompts();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">フィードバックの新規作成</h1>
      <NewMessageForm prompts={prompts} />
    </div>
  );
}
