import Header from "@/components/header/Header";
import { AppSidebarContainer } from "@/components/sidebar/app-sidebar-container";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebarContainer />
      <div className="flex flex-1 flex-col">
        <Header />
        <main
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6
            sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
