import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {
  return (
    <header className="border-b">
      <SidebarTrigger className="h-14 w-14 shrink-0 cursor-pointer" />
    </header>
  );
}
