import { LogOut } from "lucide-react";

import { signout } from "@/app/actions/auth";

import { Button } from "../ui/button";

export default function SignoutButton() {
  return (
    <form action={signout}>
      <Button variant="ghost" className="w-full justify-start">
        <LogOut />
        ログアウト
      </Button>
    </form>
  );
}
