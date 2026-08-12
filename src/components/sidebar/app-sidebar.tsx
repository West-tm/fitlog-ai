"use client";

import { Chat } from "@prisma/client";
import {
  ChartSpline,
  FileTextIcon,
  HistoryIcon,
  MessageCircleIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { NavChats } from "@/components/sidebar/nav-chats";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const privateNavItems = [
  {
    name: "新しいチャット",
    url: "/chats/new",
    icon: <MessageCircleIcon />,
  },
  {
    name: "チャット一覧",
    url: "/chats",
    icon: <HistoryIcon />,
  },
  {
    name: "指示文",
    url: "/prompts",
    icon: <FileTextIcon />,
  },
  {
    name: "健康データ",
    url: "/health",
    icon: <ChartSpline />,
  },
  {
    name: "体重データ",
    url: "/health/weight",
    icon: <ChartSpline />,
  },
];

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar({
  chats,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  chats: Chat[];
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className="flex h-14 flex-row items-center gap-2 overflow-hidden"
      >
        <div className="flex size-8 shrink-0 items-center justify-center">
          <SparklesIcon className="size-5" />
        </div>
        <Link
          href="/"
          className="min-w-0 truncate text-lg font-bold transition-opacity
            duration-200 ease-linear
            group-data-[collapsible=icon]:pointer-events-none
            group-data-[collapsible=icon]:opacity-0 hover:opacity-70"
        >
          FitLog AI
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={privateNavItems} />
        <NavChats chats={chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
