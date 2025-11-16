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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoDark from "../../../../public/assets/images/logo-black.png";
import logo from "../../../../public/assets/images/logo-white.png";
import { CircleX } from "lucide-react";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { BiCloset } from "react-icons/bi";

const AppSidebar = () => {
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
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="font-semibold px-2 py-5"
                  >
                    <Link href={menu?.url}>
                      <menu.icon />
                      {menu.title}
                      {menu.submenu?.length > 0 && (
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              {menu.submenu?.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {menu.submenu.map((sub, i) => (
                      <SidebarMenuSubItem key={i}>
                        <SidebarMenuButton asChild>
                          <Link href={sub.url}>{sub.title}</Link>
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

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
