"use client";

import { PencilIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateChatTitle } from "@/app/actions/chats";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Spinner } from "../ui/spinner";

export function RenameChatMenuItem({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onSelect={(event) => {
        event.preventDefault();

        const nextTitle = window.prompt("新しい名前", title);
        if (nextTitle === null) return;

        const trimmed = nextTitle.trim().slice(0, 40);
        if (!trimmed || trimmed === title) return;

        startTransition(async () => {
          const result = await updateChatTitle({ id, title: trimmed });
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          toast.success("チャット名を変更しました。");
        });
      }}
    >
      {isPending ? <Spinner /> : <PencilIcon />}
      {isPending ? "変更中" : "名前を変更"}
    </DropdownMenuItem>
  );
}
