"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoDark from "../../../../public/assets/images/logo-black.png";
import logo from "../../../../public/assets/images/logo-white.png";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar();
  const { auth } = useSelector((store) => store.authStore);

  return (
    <Sidebar className="z-50 fixed md:static">
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex items-center justify-start px-4 h-full w-full">
          <Image
            src={logo.src}
            height={50}
            width={logo.width}
            className="h-10 w-auto hidden dark:block"
            alt="logo"
          />
          <Image
            src={logoDark.src}
            height={50}
            width={logoDark.width}
            className="h-10 w-auto block dark:hidden"
            alt="logo dark"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                {menu.submenu?.length > 0 ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-semibold px-2 py-5">
                      <menu.icon />
                      {menu.title}
                      <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className="font-semibold px-2 py-5"
                  >
                    <Link href={menu.url} onClick={() => setOpenMobile(false)}>
                      <menu.icon />
                      {menu.title}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>

              {menu.submenu?.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {menu.submenu.map((sub, i) => (
                      <SidebarMenuSubItem key={i}>
                        <SidebarMenuButton asChild>
                          <Link href={sub.url} onClick={() => setOpenMobile(false)}>{sub.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={auth?.avatar} alt="User" />
            <AvatarFallback>{auth?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate leading-none mb-1">
              {auth?.name?.toUpperCase() || "ACCOUNT"}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-none">
              Admin Profile
            </p>
          </div>
          <LogoutButton variant="icon" className="h-8 w-8" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
