"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import SignoutButton from "./signout-button";

type Props = {
  isSignedIn: boolean;
  navItems: { href: string; label: string }[];
};

export function MobileNav({ isSignedIn, navItems }: Props) {
  return (
    <Sheet>
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

          {isSignedIn && <SignoutButton />}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
