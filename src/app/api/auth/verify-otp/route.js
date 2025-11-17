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

    // ---------------- Validate Input ----------------
    const validation = zSchema.pick({ email: true }).safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { email } = validation.data;

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

    // ---------------- Rate Limit (30s Cooldown) ----------------
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const secondsPassed = (Date.now() - lastOtp.createdAt.getTime()) / 1000;

      if (secondsPassed < 30) {
        return response(false, 429, "OTP_REQUEST_TOO_FAST");
      }
    }

    // ---------------- Remove Old OTP ----------------
    await OtpModel.deleteMany({ email });

    // ---------------- Generate New OTP ----------------
    const otp = generateOTP();

    await OtpModel.create({
      email,
      otp,
      createdAt: new Date(),
    });

    // ---------------- Send OTP Email ----------------
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
