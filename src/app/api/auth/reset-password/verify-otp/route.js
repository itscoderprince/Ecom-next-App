import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { baseSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";

const verifyOtpSchema = baseSchema.pick({ email: true, otp: true });

export async function POST(request) {
    try {
        await connectDB();

        const payload = await request.json();
        const validation = verifyOtpSchema.safeParse(payload);

        if (!validation.success) {
            return catchError({
                status: 400,
                name: "ValidationError",
                errors: validation.error.formErrors.fieldErrors
            });
        }

        const { email, otp } = validation.data;

        const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return catchError({ status: 404, message: "OTP not found or expired. Please request a new one." });
        }

        if (otpRecord.otp !== otp) {
            return catchError({ status: 400, message: "Invalid OTP. Please check and try again." });
        }

        const user = await User.findOne({ email, deletedAt: null });
        if (!user) {
            return catchError({ status: 404, message: "Associated user not found." });
        }

        await otpRecord.deleteOne();

        return successResponse("OTP verified successfully! You can now reset your password.");

    } catch (err) {
        return catchError(err);
    }
}
