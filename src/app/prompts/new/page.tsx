import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import NewPromptForm from "@/components/prompts/new-prompt-form";

export default async function NewPromptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  return (
    <>
      <div>指示文の新規作成</div>
      <NewPromptForm />
    </>
  );
}
