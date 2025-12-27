'use client'

import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_COUPON_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
    ADMIN_COUPON_EDIT,
    ADMIN_COUPON_SHOW,
    ADMIN_DASHBOARD,
    ADMIN_COUPON_ADD,
    ADMIN_TRASH,
} from "@/routes/AdminPanel.route";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_COUPON_SHOW, label: "Coupons" },
];

const ShowCoupon = () => { // Renamed from ShowProduct to ShowCoupon
    // Memoize columns to prevent unnecessary re-renders
    const columns = useMemo(() => {
        return columnConfig(DT_COUPON_COLUMN);
    }, []);

    // Memoize action buttons for the table rows
    const action = useCallback((row, deleteType, handleDelete) => {
        return (
            <div className="flex items-center gap-2">
                <EditAction key='edit' href={ADMIN_COUPON_EDIT(row.original._id)} />
                <DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />
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
                            <h4 className="font-semibold text-xl tracking-tight">Manage Coupons</h4>
                            <p className="text-sm text-muted-foreground">Create and manage discount codes for your store.</p>
                        </div>
                        <Button asChild size="sm" className="gap-2">
                            <Link href={ADMIN_COUPON_ADD}>
                                <PlusCircle className="h-4 w-4" />
                                Add Coupon
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <DatatableWrapper
                        queryKey="coupon-data"
                        fetchUrl="/api/coupon"
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint="/api/coupon/export"
                        deleteEndPoint="/api/coupon/delete"
                        deleteType="SD"
                        trashView={`${ADMIN_TRASH}?trashof=coupon`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default ShowCoupon;