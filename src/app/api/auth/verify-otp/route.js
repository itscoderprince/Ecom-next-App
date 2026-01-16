import { catchError } from "@/lib/catchError";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helperFunction";
import { otpSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { UserModel } from "@/models/userModel";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const TOKEN_EXPIRY = "7d";

export async function POST(req) {
  try {
    await dbConnect();

    if (!process.env.SECRET_KEY) {
      throw new Error("Server configuration missing (SECRET_KEY)");
    }

    const payload = await req.json();

    // 1️⃣ Validate input (Zod)
    const validation = otpSchema.safeParse(payload);
    if (!validation.success) {
      throw validation.error;
    }

    const { email, otp } = validation.data;

    // 2️⃣ Check user
    const user = await UserModel.findOne({ email, deletedAt: null }).select(
      "+isEmailVerified +role",
    );

    if (!user) {
      const err = new Error("User not found.");
      err.status = 404;
      err.isOperational = true;
      throw err;
    }

    if (!user.isEmailVerified) {
      const err = new Error("Please verify your email first.");
      err.status = 403;
      err.isOperational = true;
      throw err;
    }

    // 3️⃣ Validate OTP
    const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      const err = new Error(
        "OTP not found or expired. Please request a new one.",
      );
      err.status = 404;
      err.isOperational = true;
      throw err;
    }

    if (otpRecord.otp !== otp) {
      const err = new Error("Invalid OTP. Please check and try again.");
      err.status = 400;
      err.isOperational = true;
      throw err;
    }

    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await OtpModel.deleteMany({ email });

      const err = new Error("OTP has expired.");
      err.status = 400;
      err.isOperational = true;
      throw err;
    }

    // 4️⃣ OTP valid → delete all OTPs for this email
    await OtpModel.deleteMany({ email });

    // 5️⃣ Create access token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const accessToken = await new SignJWT({
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
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

    return response({
      success: true,
      message: "Login successful!",
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
