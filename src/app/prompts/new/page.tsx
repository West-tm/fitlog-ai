import NewPromptForm from "@/components/prompts/new-prompt-form";
import { getUser } from "@/lib/auth/get-user";

export default async function NewPromptPage() {
  await getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">指示文の新規作成</h1>
      <NewPromptForm />
    </div>
  );
}
