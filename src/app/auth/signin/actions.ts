"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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
      values,
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return {
      values,
      success: false,
      serverError: "サーバーエラーです。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
