"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_REVIEW_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_REVIEW_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanel.route";
import { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_REVIEW_SHOW, label: "Review" },
];

const ShowReview = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_REVIEW_COLUMN);
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
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded shadow-sm py-3">
        <CardHeader className="px-4 [.border-b]:pb-0 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-xl tracking-tight">
                Manage Reviews
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage the users and admin reviews.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DatatableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/review/export"
            deleteEndPoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowReview;
