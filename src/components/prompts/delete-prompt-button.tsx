"use client";

import { deletePrompt } from "@/app/actions/prompts";
import { useTransition } from "react";

type Props = {
  id: string;
};

export default function DeletePromptButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const deletePromptHandler = () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    startTransition(async () => {
      const result = await deletePrompt(id);

      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      className="hover:cursor-pointer"
      onClick={deletePromptHandler}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
