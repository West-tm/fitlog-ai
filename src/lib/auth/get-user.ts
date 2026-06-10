import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  return user;
}
