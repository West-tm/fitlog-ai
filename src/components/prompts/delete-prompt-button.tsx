"use client";

import { deletePrompt } from "@/app/prompts/[id]/action";

type DeletePromptButtonProps = {
  id: string;
};

export default function DeletePromptButton({ id }: DeletePromptButtonProps) {
  const deletePromptHandler = async () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    await deletePrompt(id);
  };

  return (
    <button className="hover:cursor-pointer" onClick={deletePromptHandler}>
      削除
    </button>
  );
}
