import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { baseSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import z from "zod";

const updatePasswordSchema = baseSchema.pick({ email: true }).extend({
  password: z.string().min(6, "Password must be at least 6 characters.").max(64, "Password too long."),
});

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();
    const validation = updatePasswordSchema.safeParse(payload);

    if (!validation.success) {
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { email, password } = validation.data;

    // ---------------- FIND USER ----------------
    const user = await User.findOne({ email, deletedAt: null }).select("+password");

    if (!user) {
      return catchError({ status: 404, message: "User not found." });
    }

    // ---------------- UPDATE PASSWORD ----------------
    user.password = password;
    await user.save();

    return successResponse("Password updated successfully! You can now log in with your new password.");

  } catch (error) {
    return catchError(error);
  }
}
