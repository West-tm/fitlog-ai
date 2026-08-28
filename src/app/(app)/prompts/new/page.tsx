import { createPrompt } from "@/app/actions/prompts";
import PromptForm from "@/components/prompts/prompt-form";
import { getUser } from "@/lib/auth/get-user";

export const metadata = {
  title: "指示文を作成",
};

export default async function NewPromptPage() {
  await getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">指示文を作成</h1>
      <PromptForm onSubmitAction={createPrompt} showTemplatePicker={true} />
    </div>
  );
}
