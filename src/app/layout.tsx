import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FitLog AI",
  description: "FitLog AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
