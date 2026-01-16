import {
  LayoutDashboard,
  Layers,
  Shirt,
  ShoppingBag,
  Users,
  Star,
  Image as ImageIcon,
  TicketPercent,
} from "lucide-react";

import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_SHOW,
  ADMIN_CUSTOMERS_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_REVIEW_SHOW,
} from "@/routes/AdminPanel.route";

export const adminAppSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Category",
    url: "#",
    icon: Layers,
    submenu: [
      {
        title: "Add Category",
        url: ADMIN_CATEGORY_ADD,
      },
      {
        title: "All Category",
        url: ADMIN_CATEGORY_SHOW,
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: Shirt,
    submenu: [
      {
        title: "Add Product",
        url: ADMIN_PRODUCT_ADD,
      },
      {
        title: "Add Variant",
        url: ADMIN_PRODUCT_VARIANT_ADD,
      },
      {
        title: "All Products",
        url: ADMIN_PRODUCT_SHOW,
      },
      {
        title: "Products Variants",
        url: ADMIN_PRODUCT_VARIANT_SHOW,
      },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icon: TicketPercent,
    submenu: [
      {
        title: "Add Coupon",
        url: ADMIN_COUPON_ADD,
      },
      {
        title: "All Coupons",
        url: ADMIN_COUPON_SHOW,
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    url: ADMIN_CUSTOMERS_SHOW,
    icon: Users,
  },
  {
    title: "Rating & Review",
    url: ADMIN_REVIEW_SHOW,
    icon: Star,
  },
  {
    title: "Media",
    url: ADMIN_MEDIA_SHOW,
    icon: ImageIcon,
  },
];
