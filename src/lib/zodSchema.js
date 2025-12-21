import z from "zod";

export const zSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name is too long"),

    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Please provide a valid email address"),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password is too long")
      .refine((pw) => /[A-Z]/.test(pw), {
        message: "Password must contain at least one uppercase letter",
      }),

    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, "Confirm Password must be at least 6 characters"),

    otp: z
      .string()
      .min(6, "OTP must be 6 digits long")
      .max(6, "OTP must be 6 digits long")
      .regex(/^\d{6}$/, "OTP must contain only numbers"),

    _id: z.string().min(3, "_id is required"),
    alt: z.string().min(3, "Alt is required"),
    title: z.string().min(3, "Title is required"),
    slug: z.string().min(3, "Slug is required"),

    category: z.string().min(3, "Slug is required"),
    mrp: z.coerce.number().positive('MRP must be a positive number'),
    sellingPrice: z.coerce.number().positive('Selling Price must be a positive number'),
    discountPercentage: z.coerce.number().min(0, 'Discount must be non-negative').max(100, 'Discount cannot exceed 100%'),
    description: z.string().min(3, "Description is required"),
    media: z.array(z.string())
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
