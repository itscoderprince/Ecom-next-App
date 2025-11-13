import z from "zod";

export const zSchema = z.object({
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
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
