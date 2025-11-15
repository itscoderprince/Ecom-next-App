// api/auth/verify-otp.js
import { connectDB } from "@/lib/db";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";

export async function POST(request) {
    try {
        await connectDB();

        const payload = await request.json();
        const validation = zSchema.pick({
            email: true,
            otp: true,
        }).safeParse(payload);

        if (!validation.success)
            return response(false, 400, "Invalid input");

        const { email, otp } = validation.data;

        const otpRecord = await OtpModel.findOne({ email });
        if (!otpRecord)
            return response(false, 404, "OTP expired, request a new one");

        if (otpRecord.otp !== otp)
            return response(false, 400, "Invalid OTP");

        const user = await User.findOne({ email, deletedAt: null }).lean();
        if (!user)
            return response(false, 404, "User not found");

        await otpRecord.deleteOne();

        return response(true, 200, "OTP verified successfully");

    } catch (err) {
        console.log(err);
        return response(false, 500, "Server error", err.message);
    }
}
