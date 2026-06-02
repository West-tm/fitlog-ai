import { z } from "zod";

export const FormSchema = z.object({
  content: z.string().min(4, "指示文は4文字以上で入力してください"),
});

export type FormValues = z.infer<typeof FormSchema>;
