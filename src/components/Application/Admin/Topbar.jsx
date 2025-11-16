"use client";

import React from "react";
import { RiMenu4Fill } from "react-icons/ri";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed h-14 top-0 left-0 w-full md:w-[calc(100%-16rem)] md:left-64 z-30 flex justify-between items-center px-4 border dark:bg-card">
      <div></div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropdown />
        <Button
          type="button"
          size="sm"
          className="ms-2 md:hidden"
          onClick={toggleSidebar}
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
