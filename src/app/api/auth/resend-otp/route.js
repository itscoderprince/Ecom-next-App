import { catchError } from "@/lib/catchError";
import dbConnect from "@/lib/dbConnection";
import { response, generateOTP } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { resendOtpSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { UserModel } from "@/models/userModel";
import { otpEmail } from "@/email/otpVerification";

export async function POST(req) {
  try {
    await dbConnect();

    const payload = await req.json();

    // 1️⃣ Validate input
    const validation = resendOtpSchema.safeParse(payload);
    if (!validation.success) {
      throw validation.error;
    }
    const { email } = validation.data;

    // 2️⃣ Check user
    const user = await UserModel.findOne({ email, deletedAt: null }).select(
      "+isEmailVerified",
    );

    if (!user) {
      const err = new Error("User not found.");
      err.status = 404;
      err.isOperational = true;
      throw err;
    }

    if (!user.isEmailVerified) {
      const err = new Error("Please verify your email address first.");
      err.status = 403;
      err.isOperational = true;
      throw err;
    }

    // 3️⃣ Rate limit (30 sec cooldown)
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const secondsPassed = (Date.now() - lastOtp.createdAt.getTime()) / 1000;

      if (secondsPassed < 30) {
        const err = new Error(
          `Please wait ${Math.ceil(
            30 - secondsPassed,
          )} seconds before requesting a new OTP.`,
        );
        err.status = 429;
        err.isOperational = true;
        throw err;
      }
    }

    // 4️⃣ Generate & send OTP
    await OtpModel.deleteMany({ email });

    const otp = generateOTP();

    await OtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // ⏱ 5 min
    });

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      html: otpEmail(otp),
    });

    return response({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    return catchError(error);
  }
}
