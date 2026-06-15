import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  return user;
}
