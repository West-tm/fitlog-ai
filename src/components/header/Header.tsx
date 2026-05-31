import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import SignoutButton from "./signout-button";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="mb-5 bg-blue-400 py-3 px-10 font-bold flex justify-between items-center">
      <Link href={"/"}>
        <span className="hover:cursor-pointer">FitLog AI</span>{" "}
      </Link>
      {!user ? (
        <div className="flex gap-3">
          <Link href={"/auth/signup"} className="hover:cursor-pointer">
            新規登録
          </Link>
          <Link href={"/auth/signin"} className="hover:cursor-pointer">
            ログイン
          </Link>
        </div>
      ) : (
        <SignoutButton />
      )}
    </header>
  );
}
