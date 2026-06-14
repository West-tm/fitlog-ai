"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function signoutAndRedirect() {
  await signout();
  redirect("/auth/signin");
}
