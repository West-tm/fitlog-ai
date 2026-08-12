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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { DeleteChatMenuItem } from "./delete-chat-menu-item";
import { RenameChatMenuItem } from "./rename-chat-menu-item";

export function NavChats({ chats }: { chats: Chat[] }) {
  const { isMobile } = useSidebar();

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
                <span>最近のチャット</span>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          showOnHover
                          className="aria-expanded:bg-muted"
                        >
                          <MoreHorizontalIcon />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-fit"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <RenameChatMenuItem id={chat.id} title={chat.title} />
                        <DropdownMenuSeparator />
                        <DeleteChatMenuItem id={chat.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
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
