"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, FormSchema } from "@/app/prompts/new/schema";
import createPrompt from "@/app/prompts/new/actions";

export default function NewPromptForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { content: "" },
    mode: "onBlur",
  });

  const onSubmit = async (value: FormValues) => {
    await createPrompt(value);
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
    </form>
  );
}
