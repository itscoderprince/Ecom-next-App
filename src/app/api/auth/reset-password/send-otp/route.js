import { connectDB } from "@/lib/db";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { generateOTP, response, catchError } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";
import { zSchema } from "@/lib/zodSchema";

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();

    // ------------------------ VALIDATION ------------------------
    const validation = zSchema.pick({ email: true }).safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { email } = validation.data;

    // ------------------------ FIND USER ------------------------
    const user = await User.findOne({ email, deletedAt: null }).select(
      "+isEmailVerified"
    );

    if (!user) return response(false, 404, "USER_NOT_FOUND");

    // Optional: Block OTP if email is not verified
    // (Remove if you WANT to send OTP even when email unverified)
    if (!user.isEmailVerified) {
      return response(false, 403, "EMAIL_NOT_VERIFIED");
    }

    // ------------------------ RATE LIMIT (OPTIONAL BUT GOOD) ------------------------
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const diff = (Date.now() - lastOtp.createdAt.getTime()) / 1000;

      if (diff < 15) {
        return response(false, 429, "OTP_REQUEST_TOO_FAST"); // 30 sec cooldown
      }
    }

    // ------------------------ DELETE OLD OTP ------------------------
    await OtpModel.deleteMany({ email });

    // ------------------------ GENERATE NEW OTP ------------------------
    const otp = generateOTP();

    await OtpModel.create({
      email,
      otp,
      createdAt: new Date(),
    });

    // ------------------------ SEND MAIL ------------------------
    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html: otpEmail(otp),
    });

    return response(true, 200, "OTP_SENT_SUCCESSFULLY");
  } catch (error) {
    return catchError(error);
  }
}
