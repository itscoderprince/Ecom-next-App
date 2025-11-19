// api/auth/register.js
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    // ------- Parse & Validate Input -------
    const payload = await request.json();

    const validation = zSchema
      .pick({ name: true, email: true, password: true })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "Invalid fields", validation.error.flatten());
    }

    const { name, email, password } = validation.data;

    // ------- Check Required ENV -------
    if (!process.env.SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) {
      return response(false, 500, "Server configuration error. Missing environment variables.");
    }

    // ------- Prevent duplicate registration -------
    const existing = await User.findOne({ email });
    if (existing) {
      return response(false, 409, "Email already registered.");
    }

    // ------- Create new user -------
    const newUser = await User.create({ name, email, password });

    // ------- Generate secure token -------
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({
      uid: newUser._id.toString(),
      type: "email-verification",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(secret);

    // Encode the token safely for URL
    const encodedToken = encodeURIComponent(token);

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${encodedToken}`;

    // ------- Send verification mail -------
    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerificationLink(verifyUrl),
    });

    return response( true, 200, "Registration successful! Please verify your email to continue.");
  } catch (err) {
    return catchError(err);
  }
}
