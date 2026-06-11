"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const signoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <button className="hover:cursor-pointer" onClick={signoutHandler}>
      ログアウト
    </button>
  );
}
