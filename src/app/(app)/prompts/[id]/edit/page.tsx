import { notFound } from "next/navigation";

import { getPrompt, updatePrompt } from "@/app/actions/prompts";
import PromptForm from "@/components/prompts/prompt-form";

export default async function EditPromptPage({
  params,
}: PageProps<"/prompts/[id]/edit">) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    notFound();
  }

  const updatePromptAction = updatePrompt.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">指示文の編集</h1>
      <PromptForm
        onSubmitAction={updatePromptAction}
        defaultValues={{ title: prompt.title, content: prompt.content }}
      />
    </div>
  );
}
