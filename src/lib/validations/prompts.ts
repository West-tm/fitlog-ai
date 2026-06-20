import { z } from "zod";

export const promptFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "タイトルは50文字以下で入力してください"),
  content: z.string().trim().min(1, "指示文を入力してください"),
});

export type PromptFormValues = z.infer<typeof promptFormSchema>;

export const createPromptSchema = promptFormSchema;

export const updatePromptSchema = createPromptSchema.extend({
  id: z.uuid(),
});
