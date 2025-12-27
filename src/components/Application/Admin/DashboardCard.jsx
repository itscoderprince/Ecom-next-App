import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DashboardCard = ({
    title,
    children,
    className,
    actionText = "View All",
    actionLink,
    onActionClick,
    headerClassName,
    contentClassName,
    showAction = true,
    variant = "default",
}) => {
    return (
        <Card className={cn("shadow-sm border-border py-3 h-full flex flex-col", className)}>
            <CardHeader
                className={cn(
                    "py-2 px-4 [.border-b]:pb-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0",
                    headerClassName
                )}
            >
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{title}</h3>
                {showAction && (
                    <ButtonLoading
                        type="button"
                        variant={variant}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={onActionClick}
                    >
                        {actionLink !== undefined ? <Link href={actionLink}>{actionText}</Link> : actionText}
                    </ButtonLoading>
                )}
            </CardHeader>
            <CardContent className={cn("p-4 flex-1", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
