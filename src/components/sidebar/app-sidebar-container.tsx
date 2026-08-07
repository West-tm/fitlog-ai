import { getChats } from "@/app/actions/chats";
import { getOptionalUser } from "@/lib/auth/get-user";

import { AppSidebar } from "./app-sidebar";

export async function AppSidebarContainer() {
  const user = await getOptionalUser();
  if (!user) return null;

  const chats = await getChats();
  return <AppSidebar chats={chats} />;
}
