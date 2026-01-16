import { catchError } from "@/lib/catchError";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helperFunction";
import { otpSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { UserModel } from "@/models/userModel";

export async function POST(request) {
    try {
        await dbConnect();

        const payload = await request.json();
        const validation = otpSchema.safeParse(payload);

        if (!validation.success) {
            throw validation.error;
        }

        const { email, otp } = validation.data;

        // Find the latest OTP for this email
        const otpRecord = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord) {
            const err = new Error("OTP not found or expired. Please request a new one.");
            err.status = 404;
            err.isOperational = true;
            throw err;
        }

        if (otpRecord.otp !== otp) {
            const err = new Error("Invalid OTP. Please check and try again.");
            err.status = 400;
            err.isOperational = true;
            throw err;
        }

        // Verify user exists
        const user = await UserModel.findOne({ email, deletedAt: null });
        if (!user) {
            const err = new Error("Associated user not found.");
            err.status = 404;
            err.isOperational = true;
            throw err;
        }

        // Delete the OTP after successful verification
        await otpRecord.deleteOne();

        return response({
            success: true,
            status: 200,
            message: "OTP verified successfully! You can now reset your password.",
        });

    } catch (err) {
        return catchError(err);
    }
}

