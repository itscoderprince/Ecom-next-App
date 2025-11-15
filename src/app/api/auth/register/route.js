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

    const payload = await request.json();
    const validation = zSchema
      .pick({
        name: true,
        email: true,
        password: true,
      })
      .safeParse(payload);

    if (!validation.success)
      return response(false, 400, "Invalid fields", validation.error);

    const { name, email, password } = validation.data;

    const exists = await User.findOne({ email });
    if (exists) return response(false, 409, "Email already registered.");

    const newUser = await User.create({ name, email, password });

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(secret);

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${token}`
      ),
    });

    return response(true, 200, "Registration successful! Please verify email.");
  } catch (err) {
    return catchError(err);
  }
}
