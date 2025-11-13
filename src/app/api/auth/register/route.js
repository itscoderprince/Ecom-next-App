import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    // Step 1: Connect to the database
    await connectDB();

    // Step 2: Validate the incoming data
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) 
        return response(false, 400, "Please fill all required fields correctly.", validatedData.error);
    

    const { name, email, password } = validatedData.data;

    // Step 3: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return response(false, 409, "This email is already registered.");


    // Step 4: Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Step 5: Make sure secret key exists
    if (!process.env.SECRET_KEY) {
      console.error("❌ Missing SECRET_KEY in environment");
      return response(false, 500, "Server error: Missing secret key.");
    }

    // Step 6: Create a verification token (JWT)
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Step 7: Send a verification email
    await sendMail({
      to: email,
      subject: "Verify your email - Panda Bee 🐝",
      html: emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/Auth/verify-email/${token}`),
    });

    // Step 8: Send success response
    return response(true, 200, "Registration successful! Please check your email to verify your account.");

  } catch (error) {
    return catchError(error, "Registration failed. Please try again later.");
  }
}
