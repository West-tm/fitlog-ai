"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  navItems: { href: string; label: string }[];
  className?: string;
};

export function MobileNav({ navItems, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="メニューを開く"
          className={cn(className)}
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}
