"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deletePrompt } from "@/app/actions/prompts";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type Props = {
  id: string;
};

export default function DeletePromptButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deletePromptHandler = () => {
    const ok = window.confirm("本当に削除しますか？");

    if (!ok) return;

    startTransition(async () => {
      const result = await deletePrompt(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("指示文を削除しました。");
      router.push("/prompts");
    });
  };

  return (
    <Button
      variant="destructive"
      className="hover:cursor-pointer"
      onClick={deletePromptHandler}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <Trash2 />}
      {isPending ? "削除中" : "削除"}
    </Button>
  );
}
