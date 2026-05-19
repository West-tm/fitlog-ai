import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
