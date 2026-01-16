import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/db";
import { catchError, successResponse, generateVerifyToken } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { baseSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";

const registerSchema = baseSchema.pick({ name: true, email: true, password: true });

export async function POST(request) {
  try {
    await connectDB();
    console.log("📝 Register: DB Connected");

    // ------- Parse & Validate Input -------
    const payload = await request.json();
    console.log("📝 Register: Payload received:", payload.email);
    const validation = registerSchema.safeParse(payload);

    if (!validation.success) {
      console.log("📝 Register: Zod Validation Error:", validation.error.formErrors.fieldErrors);
      return catchError({
        status: 400,
        name: "ValidationError",
        errors: validation.error.formErrors.fieldErrors
      });
    }

    const { name, email, password } = validation.data;

    // ------- Check Required ENV -------
    if (!process.env.SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("❌ Register: ENV MISSING");
      throw new Error("Server configuration missing (SECRET_KEY or BASE_URL)");
    }

    // ------- Prevent duplicate registration -------
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("📝 Register: User already exists:", email);
      return catchError({ status: 409, message: "This email is already registered." });
    }

    // ------- Create new user -------
    console.log("📝 Register: Creating user...");
    const newUser = await User.create({ name, email, password });
    console.log("📝 Register: User created:", newUser._id);

    // ------- Generate secure token & send mail -------
    const token = await generateVerifyToken(newUser._id);
    const encodedToken = encodeURIComponent(token);
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${encodedToken}`;

    console.log("📝 Register: Sending mail to:", email);
    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerificationLink(verifyUrl),
    });

    console.log("✅ Register: Complete!");
    return successResponse("Registration successful! Please verify your email to continue.");

  } catch (err) {
    console.error("❌ Register Crash:", err);
    return catchError(err);
  }
}
