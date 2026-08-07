"use client";

import { Chat } from "@prisma/client";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavChats({ chats }: { chats: Chat[] }) {
  return (
    <SidebarGroup
      className="truncate overflow-hidden transition-opacity duration-200
        ease-linear group-data-[collapsible=icon]:pointer-events-none
        group-data-[collapsible=icon]:opacity-0"
    >
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span>最近のチャット一覧</span>
                <ChevronRightIcon
                  className="ml-auto transition-transform duration-200
                    group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <Link className="w-[80%]" href={`/chats/${chat.id}`}>
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/chats" className="cursor-pointer">
                      <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                      <span>全てのチャット</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
