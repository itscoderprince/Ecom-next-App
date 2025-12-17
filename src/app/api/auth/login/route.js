import { connectDB } from "@/lib/db";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpVerification";
import { OtpModel } from "@/models/otpModel";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    // -------- VALIDATION --------
    const validation = zSchema
      .pick({ email: true })
      .extend({
        password: z.string().min(6, "Password must be at least 6 characters."),
      })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { email, password } = validation.data;

    // -------------------- ENV CHECK --------------------
    if (!process.env.SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      return response(false, 500, "SERVER_ENV_MISSING");
    }

    // -------------------- USER CHECK --------------------
    const user = await User.findOne({
      deletedAt: null,
      email,
    }).select("+password +isEmailVerified");

    if (!user) return response(false, 404, "EMAIL_NOT_REGISTERED");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return response(false, 401, "INVALID_CREDENTIALS");

    // ===================================================================
    //                 🔥 CASE 1: EMAIL NOT VERIFIED
    // ===================================================================
    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const verifyToken = await new SignJWT({
        uid: user._id.toString(),
        type: "email-verification",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      const encodedToken = encodeURIComponent(verifyToken);
      const verifyURL = `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${encodedToken}`;

      await sendMail({
        to: email,
        subject: "Verify your email",
        html: emailVerificationLink(verifyURL),
      });

      return response(true, 200, "EMAIL_NOT_VERIFIED_LINK_SENT");
    }

    // ===================================================================
    //                 🔥 CASE 2: EMAIL VERIFIED → SEND OTP
    // ===================================================================

    // Clear any previous OTP to prevent OTP stacking/race conditions
    await OtpModel.deleteMany({ email });

    const otp = generateOTP();

    await OtpModel.create({
      email,
      otp,
      createdAt: new Date(),
    });

    await sendMail({
      to: email,
      subject: "Your Login OTP",
      html: otpEmail(otp),
    });

    return response(true, 200, "OTP_SENT");
  } catch (error) {
    return catchError(error);
  }
}
