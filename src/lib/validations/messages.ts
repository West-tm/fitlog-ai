import { z } from "zod";

export const messageFormSchema = z.object({
  content: z.string().trim().min(1, "メッセージを入力してください"),
  promptId: z.uuid("指示文を選択してください"),
  useGoogleSearch: z.boolean("外部検索を使用するか選択してください"),
});

export type MessageFormValues = z.infer<typeof messageFormSchema>;

export const createMessageSchema = messageFormSchema;

export const updateMessageSchema = messageFormSchema.extend({
  feedbackId: z.uuid(),
});
