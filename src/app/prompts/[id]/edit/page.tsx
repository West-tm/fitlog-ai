import EditPromptForm from "@/components/prompts/edit-prompt-form";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPrompt } from "./actions";

export default async function EditPromptPage(
  editPromptPageProps: PageProps<"/prompts/[id]/edit">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { id } = await editPromptPageProps.params;
  const prompt = await getPrompt(id);

  return (
    <>
      <div>指示文の編集</div>
      <EditPromptForm prompt={prompt} />
    </>
  );
}
