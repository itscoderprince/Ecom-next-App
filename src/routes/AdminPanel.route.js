export const ADMIN_DASHBOARD = "/admin/dashboard";

// Media routes
export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit/${id}` : "");

// Category routes;
export const ADMIN_CATEGORY_SHOW = "/admin/category";
export const ADMIN_CATEGORY_ADD = "/admin/category/add";
export const ADMIN_CATEGORY_EDIT = (id) =>
  id ? `/admin/category/edit/${id}` : "";

// product route
export const ADMIN_PRODUCT_ADD = "/admin/product/add";
export const ADMIN_PRODUCT_EDIT = (id) =>
  id ? `/admin/product/edit/${id}` : "";
export const ADMIN_PRODUCT_SHOW = "/admin/product";

// product variant route
export const ADMIN_PRODUCT_VARIANT_ADD = "/admin/product-variant/add";
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) =>
  id ? `/admin/product-variant/edit/${id}` : "";
export const ADMIN_PRODUCT_VARIANT_SHOW = "/admin/product-variant";

// Coupon route
export const ADMIN_COUPON_ADD = "/admin/coupon/add";
export const ADMIN_COUPON_EDIT = (id) => (id ? `/admin/coupon/edit/${id}` : "");
export const ADMIN_COUPON_SHOW = "/admin/coupon";

// Customer route
export const ADMIN_CUSTOMERS_SHOW = "/admin/customers";

// Review route
export const ADMIN_REVIEW_SHOW = "/admin/review";

// Trash route
export const ADMIN_TRASH = "/admin/trash";
