import { z } from "zod";

/* -------------------------------------------------
   1. BASE FIELDS (PLAIN OBJECT – NEVER REFINE THIS)
-------------------------------------------------- */

export const baseSchema = z.object({
  /* ---------- Auth ---------- */
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(128)
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),

  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .min(6),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  /* ---------- Product ---------- */
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase & hyphenated"),

  description: z.string().min(10, "Description too short"),
  category: z.string().min(3, "Category is required"),

  mrp: z.coerce.number().positive("MRP must be positive"),
  sellingPrice: z.coerce.number().positive("Selling price must be positive"),

  discountPercentage: z.coerce.number().min(0).max(100),

  sku: z.string().min(3).toUpperCase(),
  color: z.string().min(2),
  size: z.string().min(1),

  media: z.array(z.string().url()).min(1, "At least one image required"),

  /* ---------- Coupon ---------- */
  code: z.string().min(3).toUpperCase(),
  minShoppingAmount: z.coerce
    .number()
    .positive("Minimum shopping amount must be positive"),

  validity: z.coerce.date({ required_error: "Validity is required" }),
});

/* -------------------------------------------------
   2. DERIVED SCHEMAS (SAFE & CLEAN)
-------------------------------------------------- */

/* ✅ Register */
export const registerSchema = baseSchema
  .pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/* ✅ Login */
export const loginSchema = baseSchema.pick({
  email: true,
  password: true,
});

/* ✅ OTP Verify */
export const otpSchema = baseSchema.pick({
  email: true,
  otp: true,
});

/* ✅ Resend OTP */
export const resendOtpSchema = baseSchema.pick({
  email: true,
});

/* ✅ Product */
export const productSchema = baseSchema
  .pick({
    title: true,
    slug: true,
    description: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    sku: true,
    color: true,
    size: true,
    media: true,
  })
  .refine((d) => d.sellingPrice <= d.mrp, {
    path: ["sellingPrice"],
    message: "Selling price cannot exceed MRP",
  });

/* ✅ Coupon */
export const couponSchema = baseSchema.pick({
  code: true,
  minShoppingAmount: true,
  discountPercentage: true,
  validity: true,
});
/* ✅ Update Password */
export const updatePasswordSchema = baseSchema
  .pick({
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
