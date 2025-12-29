import AppSidebar from "@/components/Application/Admin/AppSidebar";
import { ThemeProvider } from "@/components/Application/Admin/ThemeProvider";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AdminDashboard = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-y-auto py-4 px-2 md:p-6 space-y-6">
            {children}

            <div className="border-t pt-4 mt-auto text-center text-sm text-muted-foreground pb-4">
              © 2025 Developer Prince. All Rights Reserved.
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminDashboard;
