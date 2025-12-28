import { connectDB } from "@/lib/db";
import { User } from "@/models/userModel";
import { jwtVerify } from "jose";
import { catchError, successResponse } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("📥 Verify-Email: Received Body:", body);
    const { token } = body;

    if (!token) {
      console.warn("⚠️ Verify-Email: No token provided in request body.");
      return catchError({ status: 400, message: "Verification token is missing." });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("Server configuration missing (SECRET_KEY)");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    // ----------- Verify JWT Token -----------
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
      console.log("✅ Verify-Email: Token verified for UID:", payload.uid || payload.userId);
    } catch (error) {
      console.error("❌ Verify-Email Token Error:", error.message);
      return catchError({ status: 400, message: "The verification link is invalid or has expired." });
    }

    // ----------- Find and Verify User -----------
    const user = await User.findById(payload.uid || payload.userId).select("+isEmailVerified");
    if (!user) {
      console.error("❌ Verify-Email: User not found in DB.");
      return catchError({ status: 404, message: "Associated user not found." });
    }

    if (user.isEmailVerified) {
      return successResponse("Your email is already verified. You can log in now.", null, 200, { verified: true });
    }

    user.isEmailVerified = true;
    await user.save();

    console.log("✅ Verify-Email: Success for user:", user.email);
    return successResponse("Email verified successfully! You can now log in to your account.", null, 200);

  } catch (error) {
    console.error("❌ Verify-Email Crash:", error);
    return catchError(error);
  }
}
