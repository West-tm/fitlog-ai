import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { MobileNav } from "./mobile-nav";

const publicNavItems = [
  { href: "/auth/signup", label: "新規登録" },
  { href: "/auth/signin", label: "ログイン" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      {user ? (
        <SidebarTrigger className="h-14 w-14 shrink-0 cursor-pointer" />
      ) : (
        <div
          className="mx-auto flex w-full max-w-5xl items-center gap-6 px-4 py-3
            sm:px-6 md:justify-between lg:px-8"
        >
          <MobileNav navItems={publicNavItems} className="md:hidden" />
          <Link href={"/"} className="text-lg font-bold hover:opacity-70">
            FitLog AI
          </Link>
          <nav className="hidden items-center justify-center gap-2 md:flex">
            {publicNavItems.map((item) => (
              <Button key={item.href} asChild variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
