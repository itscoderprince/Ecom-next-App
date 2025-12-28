import { connectDB } from "@/lib/db";
import { generateOTP, catchError, successResponse } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";
import { baseSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";

const sendOtpSchema = baseSchema.pick({ email: true });

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();
    const validation = sendOtpSchema.safeParse(payload);

    if (!validation.success) {
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { email } = validation.data;

    // ------------------------ FIND USER ------------------------
    const user = await User.findOne({ email, deletedAt: null }).select("+isEmailVerified");
    if (!user) {
      return catchError({ status: 404, message: "User not found." });
    }

    if (!user.isEmailVerified) {
      return catchError({ status: 403, message: "Please verify your email address first." });
    }

    // ------------------------ RATE LIMIT (30 sec cooldown) ------------------------
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const diff = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
      if (diff < 30) {
        return catchError({ status: 429, message: `Please wait ${Math.ceil(30 - diff)} seconds before requesting a new OTP.` });
      }
    }

    // ------------------------ GENERATE & SEND NEW OTP ------------------------
    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp, createdAt: new Date() });

    await sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: otpEmail(otp),
    });

    return successResponse("A reset OTP has been sent to your email.");

  } catch (error) {
    return catchError(error);
  }
}
