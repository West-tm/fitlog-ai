"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { createPrompt } from "@/app/actions/prompts";
import { PromptTemplate } from "@/lib/prompt-templates";
import {
  createPromptSchema,
  CreatePromptValues,
} from "@/lib/validations/prompts";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { PromptTemplatePicker } from "./prompt-template-picker";

export default function NewPromptForm() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePromptValues>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { content: "" },
    mode: "onBlur",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (value: CreatePromptValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    const result = await createPrompt(value);

    if (result.error) {
      setError("root", { message: result.error });
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }
  };

  const setValueTemplate = (template: PromptTemplate) => {
    setValue("title", template.title, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("content", template.content, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4">
      <PromptTemplatePicker
        setValueTemplate={setValueTemplate}
        disabled={isPending}
      />

      <form className="space-y-4" onSubmit={handleFormSubmit}>
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
          {isPending ? <Spinner /> : <Plus />}
          {isPending ? "作成中" : "新規作成"}
        </Button>
        {errors.root && (
          <p className="text-destructive">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}
