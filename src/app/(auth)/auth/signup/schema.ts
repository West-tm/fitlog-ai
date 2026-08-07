import { z } from "zod";

export const signupActionSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください。")
      .check(z.email("正しいメールアドレスの形式を入力してください。")),
    password: z.string().min(8, "パスワードは8文字以上の長さが必要です。"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupActionSchema>;

export type SignupActionState = {
  values?: Pick<SignupValues, "email">;
  errors?: Partial<Record<keyof SignupValues, string[]>>;
  formError?: string;
  success: boolean;
};
