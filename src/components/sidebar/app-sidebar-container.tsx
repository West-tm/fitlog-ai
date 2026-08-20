import { getChats } from "@/app/actions/chats";
import { getProfile } from "@/app/actions/profile";
import { getOptionalUser } from "@/lib/auth/get-user";

import { AppSidebar } from "./app-sidebar";

export async function AppSidebarContainer() {
  const user = await getOptionalUser();
  if (!user) return null;

  const profile = await getProfile();

  const chats = await getChats();
  return (
    <AppSidebar
      chats={chats}
      name={profile?.name ?? null}
      email={user.email ?? ""}
    />
  );
}
