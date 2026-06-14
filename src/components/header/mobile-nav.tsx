"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { signout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  isSignedIn: boolean;
  navItems: { href: string; label: string }[];
};

export function MobileNav({ isSignedIn, navItems }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignout = () => {
    startTransition(async () => {
      await signout();

      setOpen(false);
      router.push("/auth/signin");
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="メニューを開く">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <SheetClose key={item.href} asChild>
              <Button asChild variant="ghost" className="justify-start">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </SheetClose>
          ))}

          {isSignedIn && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignout}
            >
              ログアウト
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
