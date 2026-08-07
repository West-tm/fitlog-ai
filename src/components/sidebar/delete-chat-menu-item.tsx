"use client";

import { Trash2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteChat } from "@/app/actions/chats";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Spinner } from "../ui/spinner";

export function DeleteChatMenuItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onSelect={(event) => {
        event.preventDefault();
        if (!window.confirm("本当に削除しますか？")) return;

        startTransition(async () => {
          const result = await deleteChat(id);
          if (result?.error) {
            alert(result.error);
            return;
          }

          if (pathname.includes(`/chats/${id}`)) {
            router.push("/chats/new");
          }
        });
      }}
    >
      {isPending ? <Spinner /> : <Trash2Icon />}
      {isPending ? "削除中" : "削除"}
    </DropdownMenuItem>
  );
}
