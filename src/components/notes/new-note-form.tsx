"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormValues } from "@/app/notes/new/schema";
import createNote from "@/app/notes/new/action";

export default function NewNoteForm() {
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
    await createNote(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <textarea
          className="w-1/8 border"
          id="content"
          placeholder="ここにノートを入力"
          {...register("content")}
          disabled={isSubmitting}
        ></textarea>
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
