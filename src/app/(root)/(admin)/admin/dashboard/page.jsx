import React from "react";
import QuickAdd from "@/components/Application/Admin/QuickAdd";
import CountOverview from "@/components/Application/Admin/CountOverview";
import DashboardCard from "@/components/Application/Admin/DashboardCard";
import { OrderOverview } from "@/components/Application/Admin/OrderOverview";
import { OrderStatus } from "@/components/Application/Admin/OrderStatus";
import { OrderSummary } from "@/components/Application/Admin/OrderSummary";
import { LatestReview } from "@/components/Application/Admin/LatestReview";
import { ADMIN_REVIEW_SHOW } from "@/routes/AdminPanel.route";

const ADMIN_ORDER_SHOW = "/admin/orders";

const page = () => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">

      {/* Top Stats Section */}
      <section className="space-y-8">
        <CountOverview />
        <QuickAdd />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Top Left: Order Overview */}
        <DashboardCard
          title="Order Overview"
          actionLink={ADMIN_ORDER_SHOW}
          className="lg:col-span-2"
          contentClassName="min-h-[300px]"
        >
          <OrderOverview />
        </DashboardCard>

        {/* Top Right: Order Status */}
        <DashboardCard
          title="Order Status"
          className="lg:col-span-1"
          contentClassName="p-0 flex flex-col justify-center"
          showAction={false}
        >
          <OrderStatus />
        </DashboardCard>

        {/* Bottom Left: Latest Orders */}
        <DashboardCard
          title="Latest Orders"
          className="lg:col-span-2"
          contentClassName="p-0"
          actionText="View All"
          actionLink={ADMIN_ORDER_SHOW}
        >
          <OrderSummary />
        </DashboardCard>

        {/* Bottom Right: Recent Reviews */}
        <DashboardCard
          title="Recent Reviews"
          actionLink={ADMIN_REVIEW_SHOW}
          className="lg:col-span-1"
          contentClassName="p-0"
        >
          <LatestReview />
        </DashboardCard>

      </div>
    </div>
  );
};

export default page;
