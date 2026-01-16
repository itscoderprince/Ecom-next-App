import { emailVerificationLink } from "@/email/emailVerificationLink";
import { catchError } from "@/lib/catchError";
import { sendMail } from "@/lib/sendMail";
import { registerSchema } from "@/lib/zodSchema";
import { generateVerifyToken, response } from "@/lib/helperFunction";
import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/models/userModel";

export async function POST(request) {
  try {
    await dbConnect();

    // ------- Parse & Validate Input -------
    const payload = await request.json();
    const validation = registerSchema.safeParse(payload);

    if (!validation.success) {
      return response({
        success: false,
        status: 400,
        message: "Validation failed",
        data: validation.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = validation.data;

    // ------- Check Required ENV -------
    if (!process.env.SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("Server configuration missing");
    }

    // ------- Prevent duplicate registration -------
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return response({
        success: false,
        status: 409,
        message: "This email is already registered.",
      });
    }

    // ------- Create new user -------
    const newUser = await UserModel.create({ name, email, password });

    // ------- Generate email verification token -------
    const token = await generateVerifyToken(newUser._id);
    const encodedToken = encodeURIComponent(token);

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${encodedToken}`;

    // ------- Send verification email -------
    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerificationLink(verifyUrl),
    });

    return response({
      success: true,
      status: 201,
      message: "Registration successful! Please verify your email to continue.",
    });
  } catch (err) {
    return catchError(err);
  }
}
