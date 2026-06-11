"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prompt } from "@prisma/client";
import { useForm } from "react-hook-form";

import { updatePrompt } from "@/app/actions/prompts";
import {
  updatePromptSchema,
  UpdatePromptValues,
} from "@/lib/validations/prompts";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <div className="flex flex-col">
        <textarea
          className="w-1/8 border"
          id="content"
          placeholder="ここに指示文を入力"
          {...register("content")}
          disabled={isSubmitting}
        />
      </div>
      {errors.content && (
        <p className="text-red-500">{errors.content.message}</p>
      )}
      <button
        className="bg-blue-200 cursor-pointer"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "編集中・・・" : "+ 編集する"}
      </button>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
    </form>
  );
}
