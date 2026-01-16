"use client";

import React from "react";
import Link from "next/link";
import {
  LucideChevronRight,
  ChevronsUpDown,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../../../public/assets/images/logo.png";

// Removed Image imports
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import Image from "next/image";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();
  const { auth } = useSelector((store) => store.authStore);
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      // onMouseLeave={() => setOpen(false)}
      className="transition-all duration-300 ease-in-out"
    >
      {/* Header: Icon and Text Section */}
      <SidebarHeader className="border-b h-14 flex items-center justify-center relative group-data-[collapsible=icon]:p-0">
        <div className="flex items-center gap-3 px-3 w-full transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Image
            src={logo.src}
            height={35}
            width={35}
            alt="Logo"
            className="shrink-0 transition-transform duration-300"
          />
          <h3 className="font-semibold text-xl tracking-tight whitespace-nowrap overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden">
            Panda-bees
          </h3>
        </div>
        {isMobile && (
          <button
            onClick={() => setOpenMobile(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-accent rounded-md md:hidden"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        )}
      </SidebarHeader>

      {/* Content: Navigation Menu */}
      <SidebarContent className="px-3 pb-3 pt-2 overflow-y-auto overflow-x-hidden no-scrollbar group-data-[collapsible=icon]:p-0">
        <SidebarMenu key={state} className="group-data-[collapsible=icon]:items-center">
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} asChild className="group/collapsible">
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="py-5 px-3 hover:bg-accent transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                    tooltip={menu.title}
                  >
                    <menu.icon className="size-5 text-muted-foreground group-hover/collapsible:text-primary transition-colors" />
                    <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                      {menu.title}
                    </span>
                    {menu.submenu?.length > 0 && (
                      <LucideChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu.submenu?.length > 0 && (
                  <CollapsibleContent>
                    <SidebarGroupContent className="ml-9 mt-1 flex flex-col border-l border-border/60">
                      {menu.submenu.map((sub, subIndex) => (
                        <SidebarMenuButton
                          key={subIndex}
                          asChild
                          size="sm"
                          className="py-3 my-0.5 px-3 text-[13.25px] font-medium text-muted-foreground hover:text-primary"
                        >
                          <Link href={sub.url}>{sub.title}</Link>
                        </SidebarMenuButton>
                      ))}
                    </SidebarGroupContent>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: User Dropdown */}
      <SidebarFooter className="border-t p-2 group-data-[collapsible=icon]:p-0">
        <SidebarMenu key={state} className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={auth?.avatar || ""} alt={auth?.name} />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {auth?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{auth?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {auth?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={auth?.avatar || ""} alt={auth?.name} />
                      <AvatarFallback className="rounded-lg">EP</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {auth?.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {auth?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive hover:text-destructive cursor-pointer gap-2"
                  onClick={() => { }}
                >
                  <LogOut className="size-4 hover:bg-destructive/10 hover:text-destructive" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
