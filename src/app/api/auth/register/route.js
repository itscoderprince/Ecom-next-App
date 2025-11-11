import { connectDB } from "@/lib/db";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    // 1️⃣ Connect to DB
    await connectDB();

    // 2️⃣ Validate Input
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 400, "Invalid or missing input field.", validatedData.error);
    }

    const { name, email, password } = validatedData.data;

    // 3️⃣ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(false, 409, "User already registered.");
    }

    // 4️⃣ Create user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // 5️⃣ Check secret key
    if (!process.env.SECRET_KEY) {
      console.error("❌ Missing SECRET_KEY in environment");
      return response(false, 500, "Server configuration error: Missing secret key.");
    }

    // 6️⃣ Generate JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: newUser._id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // 7️⃣ Send response
    return response(true, 201, "Registration successful.", {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token, 
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return response(false, 500, "Internal server error", error.message);
  }
}
