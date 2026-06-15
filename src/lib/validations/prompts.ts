import { z } from "zod";

export const createPromptSchema = z.object({
  content: z.string().trim().min(4, "指示文は4文字以上で入力してください"),
});

export type CreatePromptValues = z.infer<typeof createPromptSchema>;

export const updatePromptSchema = z.object({
  id: z.uuid(),
  content: z.string().trim().min(4, "指示文は4文字以上で入力してください"),
});

export type UpdatePromptValues = z.infer<typeof updatePromptSchema>;
