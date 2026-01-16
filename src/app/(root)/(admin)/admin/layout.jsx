import AppSidebar from "@/components/Application/Admin/AppSidebar";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar SidebarTrigger={SidebarTrigger} />

        <div className="p-5 flex-1 pb-10">{children}</div>

        <footer className="border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
          © 2026 Developer Prince. All Rights Reserved
        </footer>
      </main>
    </SidebarProvider>
  );
}
