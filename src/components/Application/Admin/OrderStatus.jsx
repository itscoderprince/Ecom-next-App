"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "Pending", count: 275, fill: "#f97316" },
  { status: "Processing", count: 200, fill: "#3b82f6" }, // Blue
  { status: "Shipped", count: 187, fill: "#22c55e" },
  { status: "Delivered", count: 173, fill: "#eab308" },  // Yellow
  { status: "Cancelled", count: 90, fill: "#ec4899" },   // Pink
  { status: "Unverified", count: 90, fill: "#64748b" },  // Slate
];

const chartConfig = {
  status: { label: "Status" },
  pending: { label: "Pending", color: "#f97316" },
  processing: { label: "Processing", color: "#3b82f6" },
  shipped: { label: "Shipped", color: "#22c55e" },
  delivered: { label: "Delivered", color: "#eab308" },
  cancelled: { label: "Cancelled", color: "#ec4899" },
  unverified: { label: "Unverified", color: "#64748b" },
};

export function OrderStatus() {
  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full p-4">
      {/* Donut Chart */}
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-xl p-3" />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={70}
              outerRadius={90}
              strokeWidth={4}
              paddingAngle={4}
              cornerRadius={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold tracking-tight"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs uppercase tracking-widest font-medium"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Dynamic Data List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {chartData.map((item) => (
            <div
              key={item.status}
              className="group flex items-center justify-between text-sm py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full ring-2 ring-opacity-20" style={{ backgroundColor: item.fill, boxShadow: `0 0 0 2px ${item.fill}20` }} />
                <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  {item.status}
                </span>
              </div>

              <div className="font-bold tabular-nums text-foreground">
                {item.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary Row */}
        <div className="flex items-center justify-between border-t pt-4 mt-2">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Total
          </span>
          <Badge variant="outline" className="px-4 py-1 text-sm font-bold bg-primary/5 border-primary/20 text-primary">
            {totalOrders.toLocaleString()} Orders
          </Badge>
        </div>
      </div>
    </div>
  );
}
