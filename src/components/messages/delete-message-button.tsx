"use client";

import { useTransition } from "react";

import { deleteMessage } from "@/app/actions/messages";

import { Button } from "../ui/button";

type Props = {
  id: string;
};

export default function DeleteMessageButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const deleteMessageHandler = () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    startTransition(async () => {
      const result = await deleteMessage(id);

      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      className="hover:cursor-pointer"
      onClick={deleteMessageHandler}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </Button>
  );
}
