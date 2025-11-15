import { connectDB } from "@/lib/db";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import z from "zod";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpVerification";
import { OtpModel } from "@/models/otpModel";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validation = zSchema
      .pick({ email: true })
      .extend({
        password: z.string().min(6, "Password must be at least 6 characters.")
      })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT");
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ deletedAt: null, email })
      .select("+password +isEmailVerified");

    if (!user) return response(false, 404, "EMAIL_NOT_REGISTERED");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return response(false, 401, "INVALID_CREDENTIALS");

    // 🔥 Email Not Verified → Send Verification Link
    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const verifyToken = await new SignJWT({ userId: user._id.toString() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      await sendMail({
        to: email,
        subject: "Verify your email",
        html: emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${verifyToken}`
        ),
      });

      return response(true, 200, "EMAIL_NOT_VERIFIED");
    }

    // 🔥 Verified → Send OTP
    await OtpModel.deleteMany({ email });

    const otp = generateOTP();
    await OtpModel.create({ email, otp });

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
