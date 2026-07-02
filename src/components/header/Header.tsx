import { LogOut } from "lucide-react";
import Link from "next/link";

import { signoutAndRedirect } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

import { Button } from "../ui/button";
import { MobileNav } from "./mobile-nav";

const publicNavItems = [
  { href: "/auth/signup", label: "新規登録" },
  { href: "/auth/signin", label: "ログイン" },
];

const privateNavItems = [
  { href: "/prompts", label: "指示文" },
  { href: "/feedbacks", label: "AI回答" },
  { href: "/settings/integrations", label: "外部サービス連携" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={"/"} className="text-lg font-bold hover:opacity-70">
          FitLog AI
        </Link>

        <nav className="hidden items-center justify-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}

          {user && (
            <form action={signoutAndRedirect}>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut />
                ログアウト
              </Button>
            </form>
          )}
        </nav>

        <div className="md:hidden">
          <MobileNav navItems={navItems} isSignedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
