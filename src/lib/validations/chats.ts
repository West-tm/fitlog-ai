import { z } from "zod";

export const updateChatTitleSchema = z.object({
  id: z.uuid(),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(40, "タイトルは40文字以下で入力してください"),
});

export type UpdateChatTitleValues = z.infer<typeof updateChatTitleSchema>;
