"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Note } from "@prisma/client";
import { useForm } from "react-hook-form";

import { updateNote } from "@/app/actions/notes";
import { updateNoteSchema, UpdateNoteValues } from "@/lib/validations/notes";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type Props = {
  note: Note;
};

export default function EditNoteFrom({ note }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateNoteValues>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: { id: note.id, content: note.content },
    mode: "onBlur",
  });

  const onSubmit = async (value: UpdateNoteValues) => {
    const result = await updateNote(value);
    if (result.error) {
      setError("root", { message: result.error });
    }
  };

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />

      <div className="space-y-2">
        <Label htmlFor="content">ノート</Label>
        <Textarea
          className="min-h-40"
          id="content"
          placeholder="ここにノートを入力"
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
