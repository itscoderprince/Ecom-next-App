"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data based on your uploaded image
const latestOrders = [
  {
    id: "order_QRhaZyqJemrDll",
    paymentId: "pay_QRhadw3rhlERu7",
    items: 1,
    status: "Delivered",
    amount: 116.0,
    fill: "#22c55e",
  },
  {
    id: "order_QRhZpXmn1vC33T",
    paymentId: "pay_QRhZsoBuzfJAFA",
    items: 1,
    status: "Delivered",
    amount: 735.0,
    fill: "#22c55e",
  },
  {
    id: "order_QRhYwea3QDme8P",
    paymentId: "pay_QRhYzq2YDrdscI",
    items: 1,
    status: "Delivered",
    amount: 382.0,
    fill: "#22c55e",
  },
  {
    id: "order_QRhY1aYeRgPkVY",
    paymentId: "pay_QRhY58T5iM5c1p",
    items: 1,
    status: "Delivered",
    amount: 492.0,
    fill: "#22c55e",
  },
  {
    id: "order_QRhX7CAQrZRcKf",
    paymentId: "pay_QRhXAdXuZryUnv",
    items: 1,
    status: "Shipped",
    amount: 458.0,
    fill: "#38bdf8",
  },
  {
    id: "order_QRhW3bKSTjVYdB",
    paymentId: "pay_QRhW7DDAhjWjd4",
    items: 1,
    status: "Processing",
    amount: 57.0,
    fill: "#facc15",
  },
  {
    id: "order_QRhpTllWurjPrj",
    paymentId: "pay_QRhpWt5wYFPW6M",
    items: 2,
    status: "Delivered",
    amount: 576.0,
    fill: "#22c55e",
  },
  {
    id: "order_QRhV6HQhZ9KxlC",
    paymentId: "pay_QRhVAq995mcriU",
    items: 1,
    status: "Cancelled",
    amount: 150.0,
    fill: "#ef4444",
  },
];

export function OrderSummary() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[180px] font-semibold text-muted-foreground uppercase text-xs tracking-wider pl-4">
              Order Id
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Payment Id
            </TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Items
            </TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground uppercase text-xs tracking-wider pr-4">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestOrders.map((order) => (
            <TableRow
              key={order.id}
              className="border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
            >
              <TableCell className="font-medium font-mono text-xs text-foreground py-4 pl-4">
                {order.id}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs font-mono">
                {order.paymentId}
              </TableCell>
              <TableCell className="text-center font-medium">
                {order.items}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: `${order.fill}10`,
                    color: order.fill,
                    borderColor: `${order.fill}30`,
                  }}
                  className="rounded-full px-3 py-0.5 text-xs font-semibold shadow-none"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-bold text-foreground pr-4">
                ₹{order.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
