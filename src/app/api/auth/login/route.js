import { connectDB } from "@/lib/db";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import z from "zod";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpVerification";
import { OtpModel } from "@/models/otpModel";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();

        const validationSchema = zSchema.pick({
            email: true,
        }).extend({
            password: z
                .string()
                .min(6, "Password must be at least 6 characters."),
        });

        const validateData = validationSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                400,
                "Invalid or missing input field.",
                validateData.error.errors
            );
        }

        const { email, password } = validateData.data;

        const user = await User.findOne({ deletedAt: null, email }).select("+password");

        if (!user)
            return response(false, 404, "Your email not registred!");

        const isPasswordVerified = await user.comparePassword(password);
        if (!isPasswordVerified)
            return response(false, 401, "Invalid email or password.");

        // ✅ Corrected verification check
        if (!user.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const verifyToken = await new SignJWT({
                userId: user._id.toString(),
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(secret);

            // Send verification link
            await sendMail({
                to: email,
                subject: "Verify your email - Panda Bee 🐝",
                html: emailVerificationLink(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${verifyToken}`
                ),
            });

            return response(
                true,
                200,
                "Your email is not verified yet. A new verification link has been sent to your inbox."
            );
        }

        await OtpModel.deleteMany({ email });

        const otp = generateOTP();
        const newOtpData = new OtpModel({ email, otp });
        await newOtpData.save();

        // Send OTP Email
        const otpEmailStatus = await sendMail({
            to: email,
            subject: "Your login verification code - Panda Bee 🐝",
            html: otpEmail(otp),
        });

        if (!otpEmailStatus)
            return response(false, 500, "Failed to send OTP email.");


        return response(true, 200, "Please verify your device using the OTP sent to your email.");

    } catch (error) {
        return catchError(error);
    }
}
