"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoteSchema, CreateNoteValues } from "@/lib/validations/notes";
import { generateFeedback } from "@/app/actions/feedbacks";
import { Prompt } from "@prisma/client";

type Props = {
  prompts: Prompt[];
};

export default function NewNoteForm({ prompts }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoteValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { content: "", promptId: "" },
    mode: "onBlur",
  });

  const onSubmit = async (value: CreateNoteValues) => {
    const result = await generateFeedback(value);

    if (result.error) {
      setError("root", {
        message: result.error,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="promptId">指示文：</label>
        <select
          className="mb-5"
          id="promptId"
          {...register("promptId")}
          disabled={isSubmitting}
        >
          <option value="">指示文を選択してください</option>

          {prompts.map((prompt) => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.content}
            </option>
          ))}
        </select>
        {errors.promptId && (
          <p className="text-red-500">{errors.promptId.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="content">ノート内容：</label>
        <textarea
          className="w-1/8 border"
          id="content"
          placeholder="ここにノートを入力"
          {...register("content")}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="useGoogleSearch">
          <input
            id="useGoogleSearch"
            type="checkbox"
            {...register("useGoogleSearch")}
          />
          外部検索を使用する
        </label>
      </div>

      <button className="bg-blue-200" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "作成中・・・" : "+ AI回答作成"}
      </button>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
    </form>
  );
}
