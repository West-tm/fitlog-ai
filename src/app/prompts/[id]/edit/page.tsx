import { getPrompt } from "@/app/actions/prompts";
import EditPromptForm from "@/components/prompts/edit-prompt-form";
import { getUser } from "@/lib/auth/get-user";

export default async function EditPromptPage({
  params,
}: PageProps<"/prompts/[id]/edit">) {
  await getUser();

  const { id } = await params;
  const prompt = await getPrompt(id);

  return (
    <>
      <div>指示文の編集</div>
      <EditPromptForm prompt={prompt} />
    </>
  );
}
