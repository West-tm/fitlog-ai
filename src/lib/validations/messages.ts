import { z } from "zod";

export const messageFormSchema = z
  .object({
    content: z.string().trim().min(1, "メッセージを入力してください"),
    promptId: z.uuid("指示文を選択してください"),
    useGoogleSearch: z.boolean("外部検索を使用するか選択してください"),
    startDate: z.iso.date("開始日を入力してください"),
    endDate: z.iso.date("終了日を入力してください"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "終了日は開始日以降の日付を選択してください",
    path: ["endDate"],
  });

export type MessageFormValues = z.infer<typeof messageFormSchema>;

export const createMessageSchema = messageFormSchema;

export const updateMessageSchema = messageFormSchema.extend({
  feedbackId: z.uuid(),
});
