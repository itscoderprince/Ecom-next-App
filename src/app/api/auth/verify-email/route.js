import { connectDB } from "@/lib/db";
import { User } from "@/models/userModel";
import { jwtVerify } from "jose";
import { response, catchError } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();

    // ----------- Validate Input -----------
    if (!token) {
      return response(false, 400, "TOKEN_NOT_PROVIDED");
    }

    // ----------- Validate ENV -----------
    if (!process.env.SECRET_KEY) {
      return response(false, 500, "SERVER_ENV_MISSING_SECRET_KEY");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    // ----------- Verify JWT Token -----------
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return response(false, 400, "INVALID_OR_EXPIRED_TOKEN");
    }

    // ----------- Find User -----------
    const user = await User.findById(payload.uid || payload.userId);
    if (!user) {
      return response(false, 404, "USER_NOT_FOUND");
    }

    // ----------- Already Verified? -----------
    if (user.isEmailVerified) {
      return response(true, 200, "EMAIL_ALREADY_VERIFIED");
    }

    // ----------- Mark as Verified -----------
    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "EMAIL_VERIFIED_SUCCESSFULLY");
  } catch (error) {
    return catchError(error);
  }
}
