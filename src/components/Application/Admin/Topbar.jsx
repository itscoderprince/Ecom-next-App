"use client";

import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";

const Topbar = ({ SidebarTrigger }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all gap-4">
      <div className="flex items-center gap-2 flex-1 md:flex-none max-w-45 sm:max-w-xs md:max-w-none">
        <SidebarTrigger />
        <AdminSearch />
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Topbar;
