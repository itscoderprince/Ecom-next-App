import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_CUSTOMERS_SHOW,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanel.route";

import { DASHBOARD_ICONS } from "@/constant/dashboardIcons";

export const stats = [
  {
    title: "Total Categories",
    icon: DASHBOARD_ICONS.category,
    link: ADMIN_CATEGORY_SHOW,
    key: "category",
    colors: {
      border: "border-l-green-400",
      bg: "bg-green-500",
    },
  },
  {
    title: "Total Products",
    icon: DASHBOARD_ICONS.product,
    link: ADMIN_PRODUCT_SHOW,
    key: "product",
    colors: {
      border: "border-l-blue-400",
      bg: "bg-blue-500",
    },
  },
  {
    title: "Total Customers",
    icon: DASHBOARD_ICONS.customer,
    link: ADMIN_CUSTOMERS_SHOW,
    key: "customer",
    colors: {
      border: "border-l-yellow-400",
      bg: "bg-yellow-500",
    },
  },
  {
    title: "Total Orders",
    icon: DASHBOARD_ICONS.order,
    link: "",
    key: "order",
    colors: {
      border: "border-l-cyan-400",
      bg: "bg-cyan-500",
    },
  },
];
