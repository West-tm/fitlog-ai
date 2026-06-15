import { z } from "zod";

export const signinActionSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください。")
    .check(z.email("正しいメールアドレスの形式を入力してください。")),
  password: z.string().min(8, "パスワードは8文字以上の長さが必要です。"),
});

type SigninValues = z.infer<typeof signinActionSchema>;

export type SigninActionState = {
  values?: Pick<SigninValues, "email">;
  errors?: Partial<Record<keyof SigninValues, string[]>>;
  formError?: string;
  success: boolean;
};
