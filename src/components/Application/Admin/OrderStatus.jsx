"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "Pending", count: 275, fill: "var(--chart-1)" },
  { status: "Processing", count: 200, fill: "var(--chart-2)" },
  { status: "Shipped", count: 187, fill: "var(--chart-3)" },
  { status: "Delivered", count: 173, fill: "var(--chart-4)" },
  { status: "Cancelled", count: 90, fill: "var(--chart-5)" },
  { status: "Unverified", count: 90, fill: "var(--muted-foreground)" },
];

const chartConfig = {
  status: { label: "Status" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  processing: { label: "Processing", color: "var(--chart-2)" },
  shipped: { label: "Shipped", color: "var(--chart-3)" },
  delivered: { label: "Delivered", color: "var(--chart-4)" },
  cancelled: { label: "Cancelled", color: "var(--chart-5)" },
  unverified: { label: "Unverified", color: "var(--muted-foreground)" },
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
