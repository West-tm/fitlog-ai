import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().trim().min(4, {
    error: "メッセージは4文字以上で入力してください",
  }),
  promptId: z.uuid({
    error: "指示文を選択してください",
  }),
  useGoogleSearch: z.boolean({
    error: "外部検索を使用するか選択してください",
  }),
});

export type CreateMessageValues = z.infer<typeof createMessageSchema>;

export const updateMessageValues = createMessageSchema.extend({
  feedbackId: z.uuid({
    error: "指示文を選択してください",
  }),
});

export type UpdateMessageSchema = z.infer<typeof updateMessageValues>;
