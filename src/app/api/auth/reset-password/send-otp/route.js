import { generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";
import { OtpModel } from "@/models/otpModel";
import { UserModel } from "@/models/userModel";
import dbConnect from "@/lib/dbConnection";
import { HTTP_STATUS } from "@/lib/httpStatus";
import { resendOtpSchema } from "@/lib/zodSchema";
import { catchError } from "@/lib/catchError";

export async function POST(req) {
  try {
    await dbConnect();

    const payload = await req.json();
    const validation = resendOtpSchema.safeParse(payload);

    if (!validation.success) {
      return response({
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Validation failed",
        data: validation.error.flatten().fieldErrors,
      });
    }

    const { email } = validation.data;

    // Find user
    const user = await UserModel.findOne({ email, deletedAt: null }).select("+isEmailVerified");

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

    // Rate limit (30 sec cooldown)
    const lastOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const diff = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
      if (diff < 30) {
        const err = new Error(`Please wait ${Math.ceil(30 - diff)} seconds before requesting a new OTP.`);
        err.status = 429;
        err.isOperational = true;
        throw err;
      }
    }

    // Generate & send new OTP
    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp, createdAt: new Date() });

    await sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: otpEmail(otp),
    });

    return response({
      success: true,
      status: HTTP_STATUS.OK,
      message: "A reset OTP has been sent to your email.",
      data: {
        type: "OTP_SENT",
        email,
      },
    });

  } catch (error) {
    return catchError(error);
  }
}

