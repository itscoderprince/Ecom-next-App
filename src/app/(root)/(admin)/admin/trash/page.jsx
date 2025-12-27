"use client";

import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DT_CATEGORY_COLUMN,
  DT_COUPON_COLUMN,
  DT_CUSTOMERS_COLUMN,
  DT_PRODUCT_COLUMN,
  DT_PRODUCT_VARIANT_COLUMN,
  DT_REVIEW_COLUMN,
} from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanel.route";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_TRASH, label: "Trash" },
];

const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
  product: {
    title: "Product Trash",
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: "/api/product",
    exportUrl: "/api/product/export",
    deleteUrl: "/api/product/delete",
  },
  "product-variant": {
    title: "Product Variant Trash",
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: "/api/product-variant",
    exportUrl: "/api/product-variant/export",
    deleteUrl: "/api/product-variant/delete",
  },
  coupon: {
    title: "Coupon Trash",
    columns: DT_COUPON_COLUMN,
    fetchUrl: "/api/coupon",
    exportUrl: "/api/coupon/export",
    deleteUrl: "/api/coupon/delete",
  },
  customers: {
    title: "Customers Trash",
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl: "/api/customers",
    exportUrl: "/api/customers/export",
    deleteUrl: "/api/customers/delete",
  },
  review: {
    title: "Review Trash",
    columns: DT_REVIEW_COLUMN,
    fetchUrl: "/api/review",
    exportUrl: "/api/review/export",
    deleteUrl: "/api/review/delete",
  },
};

const Trash = () => {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof");
  const config = TRASH_CONFIG[trashOf];

  const columns = useMemo(() => {
    if (!config) return [];
    return columnConfig(config.columns, false, false, true);
  }, [config]);

  const action = useCallback((row, deleteType, handleDelete) => {
    return (
      <>
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />
      </>
    );
  }, []);

  if (!config) {
    return (
      <div className="p-4">
        <AdminBreadcrumb breadcrumbData={breadcrumbData} />
        <Card className="py-10 rounded shadow-sm text-center">
          <h4 className="font-semibold text-xl">Trash category not found</h4>
          <p className="text-muted-foreground">
            Please select a valid trash category from the dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">{config.title}</h4>
          </div>
        </CardHeader>

        <CardContent className="mb-5 px-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint={config.exportUrl}
            deleteEndPoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Trash;
