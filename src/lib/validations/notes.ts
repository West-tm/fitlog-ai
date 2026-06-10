import { z } from "zod";

export const createNoteSchema = z.object({
  content: z.string().trim().min(4, {
    error: "ノートは4文字以上で入力してください",
  }),
  promptId: z.uuid({
    error: "指示文を選択してください",
  }),
  useGoogleSearch: z.boolean({
    error: "外部検索を使用するか選択してください",
  }),
});

export type CreateNoteValues = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  id: z.uuid(),
  content: z.string().min(4, "ノートは4文字以上で入力してください"),
});

export type UpdateNoteValues = z.infer<typeof updateNoteSchema>;
