"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createPrompt } from "@/app/actions/prompts";
import {
  createPromptSchema,
  CreatePromptValues,
} from "@/lib/validations/prompts";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          placeholder="ここにタイトルを入力"
          {...register("title")}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      {errors.content && (
        <p className="text-destructive">{errors.content.message}</p>
      )}
      <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "作成中・・・" : "+ 新規作成"}
      </Button>
      {errors.root && <p className="text-destructive">{errors.root.message}</p>}
    </form>
  );
}
