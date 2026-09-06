import { redirect } from "next/navigation";

import { createChat } from "@/app/actions/chats";
import { getPrompts } from "@/app/actions/prompts";
import MessageForm from "@/components/messages/message-form";
import { PROMPT_REQUIRED_NOTICE } from "@/lib/notice";

export const metadata = {
  title: "新しいチャット",
};

export default async function CreateChatPage() {
  const prompts = await getPrompts();

  if (prompts.length === 0) {
    redirect(`/prompts?notice=${PROMPT_REQUIRED_NOTICE}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">新しいチャットを開始する</h1>
      <MessageForm
        prompts={prompts}
        onSubmitAction={createChat}
        // チャット詳細へ遷移するまで pending のままにし、解除チラツキを防ぐ
        unlockOnSuccess={false}
      />
    </div>
  );
}
