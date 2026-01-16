import {
  Boxes,
  Package,
  Users,
  ShoppingCart,
  PlusCircle,
  Image,
  Tag,
} from "lucide-react";

import { BiCategory } from "react-icons/bi";

export const DASHBOARD_ICONS = {
  // Stats
  category: BiCategory,
  product: Package,
  customer: Users,
  order: ShoppingCart,

  // Quick actions
  addCategory: PlusCircle,
  addProduct: Boxes,
  addCoupon: Tag,
  uploadMedia: Image,
};
