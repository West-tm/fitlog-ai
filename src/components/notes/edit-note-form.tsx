"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Feedback, Note, Prompt } from "@prisma/client";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { updateFeedback } from "@/app/actions/feedbacks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateNoteSchema, updateNoteValues } from "@/lib/validations/notes";

import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

type Props = {
  prompts: Prompt[];
  prompt: Prompt;
  note: Note;
  feedback: Feedback;
};

export default function EditNoteFrom({
  prompts,
  prompt,
  note,
  feedback,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UpdateNoteSchema>({
    resolver: zodResolver(updateNoteValues),
    defaultValues: {
      content: note.content,
      promptId: prompt.id,
      useGoogleSearch: false,
      feedbackId: feedback.id,
    },
    mode: "onBlur",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (value: UpdateNoteSchema) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    const result = await updateFeedback(value);

    if (result.error) {
      setError("root", { message: result.error });
      submitLockRef.current = false;
      setIsSubmitLocked(false);
    }
  };

  const selectedPromptId = useWatch({
    control: control,
    name: "promptId",
  });

  const selectPrompt = prompts.find((prompt) => prompt.id === selectedPromptId);

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleFormSubmit}>
      <Controller
        name="promptId"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="promptId">指示文</FieldLabel>
            <FieldDescription>
              最適な結果を得るには、ノートに適した指示文を選択してください
            </FieldDescription>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger
                id="promptId"
                className="w-full **:data-[slot=select-value]:truncate"
              >
                <SelectValue placeholder="指示文は削除済みです。今回使用する指示文を選択してください" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                sideOffset={4}
                className="w-(--radix-select-trigger-width)"
              >
                {prompts.map((prompt) => (
                  <SelectItem
                    key={prompt.id}
                    value={prompt.id}
                    className="wrap-anywhere"
                  >
                    {prompt.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Collapsible className="mb-6 rounded-md data-[state=open]:bg-muted">
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" className="group">
            指示文の詳細
            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
          <div>
            {selectPrompt ? selectPrompt.content : "指示文は未選択です"}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-2">
        <Label htmlFor="content">ノート内容</Label>
        <Textarea
          className="min-h-40"
          id="content"
          placeholder="ここにノートを入力"
          {...register("content")}
          disabled={isPending}
        />
        {errors.content && (
          <p className="text-destructive">{errors.content.message}</p>
        )}
      </div>

      <Controller
        name="useGoogleSearch"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex gap-1">
              <Checkbox
                id="useGoogleSearch"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                disabled={isPending}
              />
              <FieldLabel htmlFor="useGoogleSearch">外部検索の許可</FieldLabel>
            </div>

            <FieldDescription>
              許可すると、必要に応じてAIがGoogle検索を使用するようになります
            </FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button className="cursor-pointer" type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : <Sparkles />}
        {isPending ? "再生成中" : "AI回答を再生成"}
      </Button>
      {errors.root && <p className="text-destructive">{errors.root.message}</p>}
    </form>
  );
}
