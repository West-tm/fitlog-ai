import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/get-user";

export default async function Dashboardpage() {
  // 今後実装予定
  await getUser();
  redirect("/prompts");
}
