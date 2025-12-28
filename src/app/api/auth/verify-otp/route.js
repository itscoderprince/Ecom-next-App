import { connectDB } from "@/lib/db";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { catchError, successResponse } from "@/lib/helperFunction";
import { baseSchema, zSchema } from "@/lib/zodSchema";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const TOKEN_EXPIRY = "7d";
const verifyOtpSchema = baseSchema.pick({ email: true, otp: true });

export async function POST(req) {
  try {
    await connectDB();

    if (!process.env.SECRET_KEY) {
      throw new Error("Server configuration missing (SECRET_KEY)");
    }

    const payload = await req.json();
    const validation = verifyOtpSchema.safeParse(payload);

    if (!validation.success) {
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { email, otp } = validation.data;

    // ---------------- Check User ----------------
    const user = await User.findOne({ email, deletedAt: null }).select("+isEmailVerified");

    if (!user) {
      return catchError({ status: 404, message: "User not found." });
    }

    if (!user.isEmailVerified) {
      return catchError({ status: 403, message: "Please verify your email first." });
    }

    // ---------------- Validate OTP ----------------
    const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return catchError({ status: 404, message: "OTP not found or expired. Please request a new one." });
    }

    if (otpRecord.otp !== otp) {
      return catchError({ status: 400, message: "Invalid OTP. Please check and try again." });
    }

    // Check expiry (standard Mongoose TTL indexing usually handles this, but manual check is safer)
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await OtpModel.deleteMany({ email });
      return catchError({ status: 400, message: "OTP has expired." });
    }

    // OTP is valid → remove it and log the user in
    await OtpModel.deleteMany({ email });

    // ---------------- Create Access Token ----------------
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const accessToken = await new SignJWT({
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return successResponse("Login successful!", {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    return catchError(error);
  }
}
