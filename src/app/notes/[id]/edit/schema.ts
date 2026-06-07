import { z } from "zod";

export const FormSchema = z.object({
  id: z.uuid(),
  content: z.string().min(4, "ノートは4文字以上で入力してください"),
});

export type FormValues = z.infer<typeof FormSchema>;
