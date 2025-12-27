"use client";

import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CUSTOMERS_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_CUSTOMERS_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanel.route";
import { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CUSTOMERS_SHOW, label: "Customers" },
];

const ShowCustomers = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN);
  }, []);

  // Memoize action buttons for the table rows
  const action = useCallback((row, deleteType, handleDelete) => {
    return (
      <div className="flex items-center gap-2">
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />
      </div>
    );
  }, []);

  return (
    <div className="space-y-4">
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded shadow-sm py-3">
        <CardHeader className="px-4 [.border-b]:pb-0 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-xl tracking-tight">
                Manage Customers
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage the user and admin customers .
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DatatableWrapper
            queryKey="customers-data"
            fetchUrl="/api/customers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/customers/export"
            deleteEndPoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomers;
