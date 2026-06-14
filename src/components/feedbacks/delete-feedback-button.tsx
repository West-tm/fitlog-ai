"use client";

import { useTransition } from "react";

import { deleteFeedback } from "@/app/actions/feedbacks";

import { Button } from "../ui/button";

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
    <Button
      variant="destructive"
      className="hover:cursor-pointer"
      onClick={deleteFeedbackHandler}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </Button>
  );
}
