"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prompt } from "@prisma/client";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { updatePrompt } from "@/app/actions/prompts";
import {
  updatePromptSchema,
  UpdatePromptValues,
} from "@/lib/validations/prompts";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
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
    defaultValues: {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
    },
    mode: "onBlur",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (value: UpdatePromptValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    const result = await updatePrompt(value);

    if (result.error) {
      setError("root", { message: result.error });
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <input type="hidden" {...register("id")} />

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>

        <Input
          id="title"
          placeholder="ここにタイトルを入力"
          {...register("title")}
          disabled={isPending}
        />
      </div>
      {errors.title && (
        <p className="text-destructive">{errors.title.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">指示文</Label>

        <Textarea
          className="min-h-40"
          id="content"
          placeholder="ここに指示文を入力"
          {...register("content")}
          disabled={isPending}
        />
      </div>
      {errors.content && (
        <p className="text-destructive">{errors.content.message}</p>
      )}

      <Button className="cursor-pointer" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : <Save />}
        {isPending ? "保存中" : "保存"}
      </Button>
      {errors.root && <p className="text-destructive">{errors.root.message}</p>}
    </form>
  );
}
