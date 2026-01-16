import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";

const AdminBreadcrumb = ({ breadcrumbData = [] }) => {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        {breadcrumbData.map((item, index) => {
          const isLast = index === breadcrumbData.length - 1;

          return (
            <React.Fragment key={index}>
              {!isLast ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumb;
