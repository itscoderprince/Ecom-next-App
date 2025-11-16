import AppSidebar from "@/components/Application/Admin/AppSidebar";
import { ThemeProvider } from "@/components/Application/Admin/ThemeProvider";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <main className="md:w-[calc(100vw-16rem)] w-full">
          {/* Main content */}
          <div className="pt-18 px-4 min-h-[calc(100vh-40px)]">
            <Topbar />
            {children}
          </div>

          {/* Footer */}
          <div className="border-t h-10 bg-gray-50 dark:bg-background flex justify-center items-center text-sm">
            © 2025 Developer Prince. All Rights Reserved.
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminDashboard;
