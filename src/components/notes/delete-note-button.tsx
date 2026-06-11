"use client";

import { useTransition } from "react";

import { deleteNote } from "@/app/actions/notes";

type Props = {
  id: string;
};

export default function DeleteNoteButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const deleteNoteHandler = () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    startTransition(async () => {
      const result = await deleteNote(id);

      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      className="hover:cursor-pointer"
      onClick={deleteNoteHandler}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
