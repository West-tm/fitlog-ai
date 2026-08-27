"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prompt } from "@prisma/client";
import { CircleHelpIcon, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTokyoDateRangeStrings } from "@/lib/date";
import {
  createMessageSchema,
  MessageFormValues,
} from "@/lib/validations/messages";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Spinner } from "../ui/spinner";

type Props = {
  prompts: Prompt[];
  onSubmitAction: (values: MessageFormValues) => Promise<{ error: string }>;
  defaultValues?: MessageFormValues;
  unlockOnSuccess?: boolean;
};

export default function MessageForm({
  prompts,
  onSubmitAction,
  defaultValues = {
    content: "",
    promptId: "",
    useGoogleSearch: false,
    ...getTokyoDateRangeStrings(89),
  },
  unlockOnSuccess = true,
}: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    control,
  } = useForm<MessageFormValues>({
    resolver: zodResolver(createMessageSchema),
    defaultValues,
    mode: "onBlur",
  });

  const submitLockRef = useRef(false);
  const [isSubmitLocked, setIsSubmitLocked] = useState(false);

  const isPending = isSubmitting || isSubmitLocked;

  // refガードをレンダー中に評価しないよう、handleSubmitはsubmit時に実行する
  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  const unlock = () => {
    submitLockRef.current = false;
    setIsSubmitLocked(false);
  };

  const onSubmit = async (value: MessageFormValues) => {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitLocked(true);

    try {
      const result = await onSubmitAction(value);

      if (result?.error) {
        setError("root", { message: result.error });
        unlock();
        return;
      }
    } finally {
      if (unlockOnSuccess) {
        unlock();
      }
    }
  };

  const selectedPromptId = useWatch({
    control: control,
    name: "promptId",
  });

  const selectPrompt = prompts.find((prompt) => prompt.id === selectedPromptId);

  const isDeletedPrompt = defaultValues.content && !defaultValues.promptId;
  const promptPlaceholder = isDeletedPrompt
    ? "指示文は削除済みです。今回使用する指示文を選択してください。"
    : "指示文を選択";

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <InputGroup
        className="border-foreground/30
          has-[[data-slot][aria-invalid=true]]:border-foreground/30
          has-[[data-slot][aria-invalid=true]]:ring-0"
      >
        <InputGroupTextarea
          id="content"
          aria-label="メッセージ"
          placeholder="ここにメッセージを入力"
          className="min-h-20"
          {...register("content")}
          disabled={isPending}
          aria-invalid={!!errors.content}
        />

        <InputGroupAddon
          align="block-start"
          className="flex-col justify-between border-b border-foreground/20
            text-foreground"
        >
          <Controller
            name="promptId"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex items-center gap-1">
                  <FieldLabel className="w-20 shrink-0" htmlFor="promptId">
                    指示文
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="指示文の説明"
                      >
                        <CircleHelpIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto text-sm">
                      最適な結果を得るには、メッセージに適した指示文を選択してください
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverAnchor asChild>
                      <div className="flex min-w-0 flex-1 items-center gap-1">
                        <div className="w-0 flex-1">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger
                              id="promptId"
                              className="w-full text-left"
                            >
                              <SelectValue placeholder={promptPlaceholder} />
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
                        </div>

                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="sm">
                            詳細
                          </Button>
                        </PopoverTrigger>
                      </div>
                    </PopoverAnchor>

                    <PopoverContent
                      align="start"
                      className="max-h-60 w-(--radix-popper-anchor-width)
                        overflow-y-auto text-sm whitespace-pre-wrap"
                    >
                      {selectPrompt?.content ?? "指示文は未選択です"}
                    </PopoverContent>
                  </Popover>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <div className="flex flex-wrap items-center gap-1">
              <FieldLabel className="w-20 shrink-0" htmlFor="startDate">
                健康データ
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    aria-label="健康データの説明"
                  >
                    <CircleHelpIcon className="size-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto text-sm">
                  使用する健康データの期間を指定してください
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-1">
                <Input
                  className="w-36"
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  disabled={isPending}
                />

                <span className="text-muted-foreground">〜</span>

                <Input
                  className="w-36"
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  disabled={isPending}
                />
              </div>
            </div>

            {errors.startDate && <FieldError errors={[errors.startDate]} />}
            {errors.endDate && <FieldError errors={[errors.endDate]} />}
          </Field>
        </InputGroupAddon>

        <InputGroupAddon
          align="block-end"
          className="justify-between border-t border-foreground/20
            text-foreground"
        >
          <Controller
            name="useGoogleSearch"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="useGoogleSearch"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    disabled={isPending}
                  />

                  <FieldLabel htmlFor="useGoogleSearch">
                    外部検索の許可
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        aria-label="外部検索の許可"
                      >
                        <CircleHelpIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto text-sm">
                      許可すると、必要に応じてAIがGoogle検索を使用するようになります
                    </PopoverContent>
                  </Popover>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <InputGroupButton
            type="submit"
            variant="default"
            size="sm"
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? <Spinner /> : <Sparkles />}
            {isPending ? "分析中" : "AI回答を生成"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {errors.content && <FieldError errors={[errors.content]} />}
      {errors.root && <p className="text-destructive">{errors.root.message}</p>}
    </form>
  );
}
