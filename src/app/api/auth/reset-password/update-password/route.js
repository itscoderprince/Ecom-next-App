import { connectDB } from "@/lib/db";
import { response, catchError } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import z from "zod";

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ---------------- VALIDATION ----------------
    const validation = zSchema
      .pick({ email: true })
      .extend({
        password: z
          .string()
          .min(6, "Password must be at least 6 characters.")
          .max(64, "Password too long."),
      })
      .safeParse(payload);

    if (!validation.success) {
      return response(
        false,
        400,
        "INVALID_INPUT",
        validation.error.flatten()
      );
    }

    const { email, password } = validation.data;

    // ---------------- FIND USER ----------------
    const user = await User.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!user) return response(false, 404, "USER_NOT_FOUND");
    
    // ---------------- UPDATE PASSWORD ----------------
    user.password = password; 
    await user.save();

    return response(true, 200, "PASSWORD_UPDATED_SUCCESSFULLY");
  } catch (error) {
    return catchError(error);
  }
}
