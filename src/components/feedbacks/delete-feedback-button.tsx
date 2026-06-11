"use client";

import { useTransition } from "react";

import { deleteFeedback } from "@/app/actions/feedbacks";

type Props = {
  id: string;
};

export default function DeleteFeedbackButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const deleteFeedbackHandler = () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    startTransition(async () => {
      const result = await deleteFeedback(id);

      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      className="bg-red-500 px-3 py-1 rounded text-white hover:cursor-pointer"
      onClick={deleteFeedbackHandler}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
