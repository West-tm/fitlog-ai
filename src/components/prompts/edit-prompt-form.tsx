"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormValues } from "@/app/prompts/[id]/edit/schema";
import { Prompt } from "@prisma/client";
import { updatePrompt } from "@/app/prompts/[id]/edit/actions";

type EditPromptFormProps = {
  prompt: Prompt;
};

export default function EditPromptForm({ prompt }: EditPromptFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { id: prompt.id, content: prompt.content },
    mode: "onBlur",
  });

  const onSubmit = async (value: FormValues) => {
    await updatePrompt(value);
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
    </form>
  );
}
