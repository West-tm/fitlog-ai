"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Note } from "@prisma/client";
import { updateNoteSchema, UpdateNoteValues } from "@/lib/validations/notes";
import { updateNote } from "@/app/actions/notes";

type Props = {
  note: Note;
};

export default function EditNoteFrom({ note }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateNoteValues>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: { id: note.id, content: note.content },
    mode: "onBlur",
  });

  const onSubmit = async (value: UpdateNoteValues) => {
    await updateNote(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <div className="flex flex-col">
        <textarea
          className="w-1/8 border"
          id="content"
          placeholder="ここにノートを入力"
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
