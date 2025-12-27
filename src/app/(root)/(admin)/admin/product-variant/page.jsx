"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanel.route";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product" },
];

const ShowProductVariant = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return (
      <>
        <EditAction
          key="edit"
          href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}
        />
        <DeleteAction
          key="delete"
          handleDelete={handleDelete}
          row={row}
          deleteType={deleteType}
        />
      </>
    );
  }, []);

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Show Product Variant</h4>
            <Button className="cursor-pointer">
              <PlusCircle />
              <Link href={ADMIN_PRODUCT_VARIANT_ADD}>Add Variant</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="mb-5 px-0">
          <DatatableWrapper
            queryKey="product-variant-data"
            fetchUrl="/api/product-variant"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/product-variant/export"
            deleteEndPoint="/api/product-variant/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product-variant`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowProductVariant;
