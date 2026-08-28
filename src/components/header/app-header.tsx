import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <SidebarTrigger className="h-14 w-14 shrink-0 cursor-pointer" />
    </header>
  );
}
