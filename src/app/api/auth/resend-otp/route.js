// api/auth/resend-otp.js
import { connectDB } from "@/lib/db";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) return response(false, 404, "User not found");

    await OtpModel.deleteMany({ email });

    const otp = generateOTP();
    await OtpModel.create({ email, otp });

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html: otpEmail(otp),
    });

    return response(true, 200, "OTP_RESENT");
  } catch (err) {
    return response(false, 500, err.message);
  }
}
