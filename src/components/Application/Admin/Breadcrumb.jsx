"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildRouteMap } from "@/lib/adminBreadcrumbs";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import React from "react";
const routeMap = buildRouteMap(adminAppSidebarMenu);

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const paths = segments.map((_, idx) => {
    return "/" + segments.slice(0, idx + 1).join("/");
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home Item */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((path, i) => {
          const label = routeMap[path] || segments[i];

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />

              {i === paths.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
