import { notFound } from "next/navigation";

import { getPrompt } from "@/app/actions/prompts";
import EditPromptForm from "@/components/prompts/edit-prompt-form";

export default async function EditPromptPage({
  params,
}: PageProps<"/prompts/[id]/edit">) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    notFound();
  }

  return (
    <>
      <div>指示文の編集</div>
      <EditPromptForm prompt={prompt} />
    </>
  );
}
