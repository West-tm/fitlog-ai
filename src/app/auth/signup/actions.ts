"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import { signupActionSchema, SignupActionState } from "./schema";

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
) {
  const values = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
  };

  const result = signupActionSchema.safeParse(values);

  if (!result.success) {
    return {
      values: { email: values.email },
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { email, password } = result.data;
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.warn("サインアップに失敗しました:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    return {
      values: { email },
      success: false,
      formError:
        "登録に失敗しました。\n入力内容を確認してもう一度お試しください。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/auth/signup/before-confirm");
}
