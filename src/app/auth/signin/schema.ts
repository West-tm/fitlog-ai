import { z } from "zod";

export const signinActionSchema = z.object({
  email: z.email("正しいメールアドレスの形式を入力してください。"),
  password: z.string().min(8, "パスワードは8文字以上の長さが必要です。"),
});

export type SigninActionState = {
  values?: z.infer<typeof signinActionSchema>;
  errors?: Partial<Record<keyof z.infer<typeof signinActionSchema>, string[]>>;
  serverError?: string;
  success: boolean;
};
