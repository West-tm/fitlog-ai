import NewPromptForm from "@/components/prompts/new-prompt-form";
import { getUser } from "@/lib/auth/get-user";

export default async function NewPromptPage() {
  await getUser();

  return (
    <>
      <div>指示文の新規作成</div>
      <NewPromptForm />
    </>
  );
}
