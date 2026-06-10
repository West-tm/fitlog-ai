import { getUser } from "@/lib/auth/get-user";
import NewPromptForm from "@/components/prompts/new-prompt-form";

export default async function NewPromptPage() {
  await getUser();

  return (
    <>
      <div>指示文の新規作成</div>
      <NewPromptForm />
    </>
  );
}
