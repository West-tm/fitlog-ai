import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";

export default async function Home() {
  // 今後実装予定
  await getUser();
  redirect("/chats/new");
}
