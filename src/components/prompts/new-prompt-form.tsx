"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createPrompt } from "@/app/actions/prompts";
import {
  createPromptSchema,
  CreatePromptValues,
} from "@/lib/validations/prompts";

export default function NewPromptForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatePromptValues>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { content: "" },
    mode: "onBlur",
  });

  const onSubmit = async (value: CreatePromptValues) => {
    const result = await createPrompt(value);
    if (result.error) {
      setError("root", { message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button className="bg-blue-200" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "作成中・・・" : "+ 新規作成"}
      </button>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
    </form>
  );
}
