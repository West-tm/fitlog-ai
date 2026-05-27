"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const signupActionSchema = z.object({
  email: z.email("正しいメールアドレスの形式を入力してください。"),
  password: z.string().min(8, "パスワードは8文字以上が必要です。"),
});

export type SignupActionState = {
  message: string;
  errors: {
    email?: string[];
    password?: string[];
  };
};

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const parsed = signupActionSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      message: "入力内容を確認してください",
      errors: fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return {
      message: error.message,
      errors: {},
    };
  }

  revalidatePath("/", "layout");
  redirect("/auth/signup/before-confirm");
}
