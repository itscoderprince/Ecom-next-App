import { connectDB } from "@/lib/db";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { generateOTP, catchError, successResponse } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";
import { baseSchema } from "@/lib/zodSchema";

const resendOtpSchema = baseSchema.pick({ email: true });

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();
    const validation = resendOtpSchema.safeParse(payload);

    if (!validation.success) {
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { email } = validation.data;

    // ---------------------- Check User ----------------------
    const user = await User.findOne({ email, deletedAt: null }).select("+isEmailVerified");
    if (!user) {
      return catchError({ status: 404, message: "User not found." });
    }

    if (!user.isEmailVerified) {
      return catchError({ status: 403, message: "Please verify your email address first." });
    }

    // ---------------------- Rate Limit (30 sec cooldown) ----------------------
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const secondsPassed = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
      if (secondsPassed < 30) {
        return catchError({ status: 429, message: `Please wait ${Math.ceil(30 - secondsPassed)} seconds before requesting a new OTP.` });
      }
    }

    // ---------------------- Generate & Send New OTP ----------------------
    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp, createdAt: new Date() });

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html: otpEmail(otp),
    });

    return successResponse("A new OTP has been sent to your email.");

  } catch (err) {
    return catchError(err);
  }
}
