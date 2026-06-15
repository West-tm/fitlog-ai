"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prompt } from "@prisma/client";
import { useForm } from "react-hook-form";

import { updatePrompt } from "@/app/actions/prompts";
import {
  updatePromptSchema,
  UpdatePromptValues,
} from "@/lib/validations/prompts";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type Props = {
  prompt: Prompt;
};

export default function EditPromptForm({ prompt }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePromptValues>({
    resolver: zodResolver(updatePromptSchema),
    defaultValues: { id: prompt.id, content: prompt.content },
    mode: "onBlur",
  });

  const onSubmit = async (value: UpdatePromptValues) => {
    const result = await updatePrompt(value);
    if (result.error) {
      setError("root", { message: result.error });
    }
  };

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <div className="space-y-2">
        <Label htmlFor="content">指示文</Label>

        <Textarea
          className="min-h-40"
          id="content"
          placeholder="ここに指示文を入力"
          {...register("content")}
          disabled={isSubmitting}
        />
      </div>
      {errors.content && (
        <p className="text-destructive">{errors.content.message}</p>
      )}

      <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "編集中・・・" : "+ 編集する"}
      </Button>
      {errors.root && <p className="text-destructive">{errors.root.message}</p>}
    </form>
  );
}
