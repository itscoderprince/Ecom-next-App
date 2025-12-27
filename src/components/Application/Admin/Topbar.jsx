"use client";

import React from "react";
import { RiMenu4Fill } from "react-icons/ri";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all">

      <AdminSearch />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <RiMenu4Fill />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Topbar;
