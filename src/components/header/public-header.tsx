"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const publicNavItems = [
  { href: "/auth/signup", label: "新規登録" },
  { href: "/auth/signin", label: "ログイン" },
];

export default function PublicHeader() {
  const pathname = usePathname();

  const navItems = publicNavItems.filter(
    (item) => !pathname.startsWith(item.href),
  );

  return (
    <header className="border-b">
      <div
        className="mx-auto flex w-full max-w-5xl items-center justify-between
          gap-6 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/auth/signin"
          className="text-lg font-bold hover:opacity-70"
        >
          FitLog AI
        </Link>
        <nav className="flex items-center justify-center gap-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
