import { connectDB } from "@/lib/db";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { response, catchError } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const TOKEN_EXPIRY = "7d";

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();

    // ---------------- Validate Input ----------------
    const validation = zSchema
      .pick({ email: true, otp: true })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    if (!process.env.SECRET_KEY) {
      return response(false, 500, "SERVER_ENV_MISSING_SECRET_KEY");
    }

    const { email, otp } = validation.data;

    // ---------------- Check User ----------------
    const user = await User.findOne({ email, deletedAt: null }).select(
      "+isEmailVerified"
    );

    if (!user) {
      return response(false, 404, "USER_NOT_FOUND");
    }

    if (!user.isEmailVerified) {
      return response(false, 403, "EMAIL_NOT_VERIFIED");
    }

    // ---------------- Validate OTP ----------------
    const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return response(false, 404, "OTP_NOT_FOUND");
    }

    if (otpRecord.otp !== otp) {
      return response(false, 400, "INVALID_OTP");
    }

    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await OtpModel.deleteMany({ email });
      return response(false, 400, "OTP_EXPIRED");
    }

    // OTP is valid → remove it
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
      secure: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response(true, 200, "LOGIN_SUCCESS", {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return catchError(error);
  }
}
