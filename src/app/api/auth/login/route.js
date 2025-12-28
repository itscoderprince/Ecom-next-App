import { connectDB } from "@/lib/db";
import { catchError, successResponse, generateVerifyToken, generateOTP } from "@/lib/helperFunction";
import { baseSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpVerification";
import { OtpModel } from "@/models/otpModel";
import z from "zod";

const loginSchema = baseSchema.pick({ email: true }).extend({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function POST(request) {
  try {
    await connectDB();

    // Check required environment variables
    if (!process.env.SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("Server configuration missing (SECRET_KEY or BASE_URL)");
    }

    const payload = await request.json();
    const validation = loginSchema.safeParse(payload);

    if (!validation.success) {
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { email, password } = validation.data;
    const user = await User.findOne({ email, deletedAt: null }).select("+password +isEmailVerified");

    if (!user) {
      return catchError({ status: 404, message: "This email is not registered." });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return catchError({ status: 401, message: "Invalid email or password." });
    }

    // Handle Unverified Email
    if (!user.isEmailVerified) {
      const verifyToken = await generateVerifyToken(user._id);
      const encodedToken = encodeURIComponent(verifyToken);
      const verifyURL = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${encodedToken}`;

      await sendMail({
        to: email,
        subject: "Verify your email",
        html: emailVerificationLink(verifyURL),
      });

      return successResponse("Verification link sent to your email.", null, 200, { type: "VERIFICATION_SENT" });
    }

    // Handle Verified User → Send Login OTP
    await OtpModel.deleteMany({ email });

    // Generate 6-digit OTP
    const otp = generateOTP();

    await OtpModel.create({ email, otp, createdAt: new Date() });

    await sendMail({
      to: email,
      subject: "Your Login OTP",
      html: otpEmail(otp),
    });

    return successResponse("OTP sent to your email.", null, 200, { type: "OTP_SENT" });

  } catch (error) {
    return catchError(error);
  }
}
