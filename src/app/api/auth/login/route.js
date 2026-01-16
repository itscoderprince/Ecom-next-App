import dbConnect from "@/lib/dbConnection";
import { catchError } from "@/lib/catchError";
import { HTTP_STATUS } from "@/lib/httpStatus";

import { loginSchema } from "@/lib/zodSchema";
import { UserModel } from "@/models/userModel";
import { OtpModel } from "@/models/otpModel";

import { sendMail } from "@/lib/sendMail";
import {
  generateVerifyToken,
  generateOTP,
  response,
} from "@/lib/helperFunction";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpVerification";

export async function POST(request) {
  try {
    await dbConnect();

    const payload = await request.json();

    // 1️⃣ Validate input
    const validation = loginSchema.safeParse(payload);
    if (!validation.success) {
      return response({
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Validation failed",
        data: validation.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validation.data;

    // 2️⃣ Find user
    const user = await UserModel.findOne({ email }).select(
      "+password +isEmailVerified",
    );

    if (!user) {
      return response({
        success: false,
        status: HTTP_STATUS.NOT_FOUND,
        message: "User not found. Please create an account.",
      });
    }

    // 3️⃣ Password check
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return response({
        success: false,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Email not verified → STOP LOGIN
    if (!user.isEmailVerified) {
      const token = await generateVerifyToken(user._id);
      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${encodeURIComponent(
        token,
      )}`;

      await sendMail({
        to: email,
        subject: "Verify your email",
        html: emailVerificationLink(verifyUrl),
      });

      return response({
        success: false,
        status: HTTP_STATUS.FORBIDDEN,
        message: "Email not verified. Verification link sent on email.",
        data: { type: "EMAIL_VERIFICATION_REQUIRED" },
      });
    }

    // 5️⃣ Clear old OTPs
    await OtpModel.deleteMany({ email });

    // 6️⃣ Generate OTP (6 digit)
    const otp = generateOTP();

    await OtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 7️⃣ Send OTP email
    await sendMail({
      to: email,
      subject: "Login OTP",
      html: otpEmail(otp),
    });

    return response({
      success: true,
      status: HTTP_STATUS.OK,
      message: "OTP sent to your email",
      data: {
        type: "OTP_SENT",
        email,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
