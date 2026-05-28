"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signupActionSchema, SignupActionState } from "./schema";

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
) {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = signupActionSchema.safeParse(values);

  if (!result.success) {
    return {
      values,
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(result.data);

  if (error) {
    return {
      values,
      success: false,
      serverError: "サーバーエラーです。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/auth/signup/before-confirm");
}
