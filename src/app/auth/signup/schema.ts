import { z } from "zod";

export const signupActionSchema = z
  .object({
    email: z.email("正しいメールアドレスの形式を入力してください。"),
    password: z.string().min(8, "パスワードは8文字以上の長さが必要です。"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type SignupActionState = {
  values?: z.infer<typeof signupActionSchema>;
  errors?: Partial<Record<keyof z.infer<typeof signupActionSchema>, string[]>>;
  serverError?: string;
  success: boolean;
};
