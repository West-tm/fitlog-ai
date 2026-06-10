"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import { signinActionSchema, SigninActionState } from "./schema";

export async function signinAction(
  _prevState: SigninActionState,
  formData: FormData,
) {
  const values = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const result = signinActionSchema.safeParse(values);

  if (!result.success) {
    return {
      values: { email: values.email },
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    console.warn("サインインに失敗しました:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    return {
      values: { email: result.data.email },
      success: false,
      formError: "メールアドレスまたはパスワードが正しくありません。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
