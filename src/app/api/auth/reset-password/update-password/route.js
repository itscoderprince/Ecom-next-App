import { catchError } from "@/lib/catchError";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helperFunction";
import { updatePasswordSchema } from "@/lib/zodSchema";
import { UserModel } from "@/models/userModel";

export async function PUT(request) {
  try {
    await dbConnect();

    const payload = await request.json();
    const validation = updatePasswordSchema.safeParse(payload);

    if (!validation.success) {
      throw validation.error;
    }

    const { email, password } = validation.data;

    // Find user
    const user = await UserModel.findOne({ email, deletedAt: null }).select("+password");

    if (!user) {
      const err = new Error("User not found.");
      err.status = 404;
      err.isOperational = true;
      throw err;
    }

    // Update password
    user.password = password;
    await user.save();

    return response({
      success: true,
      status: 200,
      message: "Password updated successfully! You can now log in with your new password.",
    });

  } catch (error) {
    return catchError(error);
  }
}

