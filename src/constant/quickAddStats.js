import {
  ADMIN_CATEGORY_ADD,
  ADMIN_PRODUCT_ADD,
  ADMIN_COUPON_ADD,
  ADMIN_CATEGORY_SHOW,
} from "@/routes/AdminPanel.route";

import { DASHBOARD_ICONS } from "@/constant/dashboardIcons";

export const quickAddStats = [
  {
    title: "Add Categories",
    link: ADMIN_CATEGORY_ADD,
    icon: DASHBOARD_ICONS.addCategory,
    colors: {
      border: "border-l-green-400",
      bg: "bg-green-500",
      gradient: "from-green-400 via-green-500 to-green-600",
    },
  },
  {
    title: "Add Products",
    link: ADMIN_PRODUCT_ADD,
    icon: DASHBOARD_ICONS.addProduct,
    colors: {
      border: "border-l-blue-400",
      bg: "bg-blue-500",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
    },
  },
  {
    title: "Add Coupon",
    link: ADMIN_COUPON_ADD,
    icon: DASHBOARD_ICONS.addCoupon,
    colors: {
      border: "border-l-yellow-400",
      bg: "bg-yellow-500",
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
    },
  },
  {
    title: "Upload Media",
    link: ADMIN_CATEGORY_SHOW,
    icon: DASHBOARD_ICONS.uploadMedia,
    colors: {
      border: "border-l-cyan-400",
      bg: "bg-cyan-500",
      gradient: "from-cyan-400 via-cyan-500 to-cyan-600",
    },
  },
];
