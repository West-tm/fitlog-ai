import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "@/components/header/Header";
import { AppSidebarContainer } from "@/components/sidebar/app-sidebar-container";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FitLog AI",
  description: "FitLog AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <body className="min-h-svh">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebarContainer />
            <div className="flex flex-1 flex-col">
              <Header />
              <main
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4
                  py-6 sm:px-6 lg:px-8"
              >
                {children}
              </main>
              <Analytics />
              <SpeedInsights />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
