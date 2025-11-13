import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { User } from "@/models/userModel";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    // 1️⃣ Extract token from request body
    const { token } = await request.json();
    if (!token) return response(false, 400, "Verification token missing.");

    // 2️⃣ Decode and verify token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    let verified;

    try {
      verified = await jwtVerify(token, secret);
    } catch (err) {
      console.log(err);
      return response(false, 401, "Invalid or expired token.");
    }

    const userId = verified.payload.userId;
    console.log("Decoded userId:", userId);

    // 3️⃣ Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(false, 400, "Invalid token payload.");
    }

    // 4️⃣ Find user in DB
    const user = await User.findById(userId);
    console.log("Fetched user:", user);

    if (!user) return response(false, 404, "User not found.");

    // 5️⃣ Use the correct field name from your schema ✅
    if (user.isEmailVerified) {
      return response(true, 200, "Email is already verified.");
    }

    // 6️⃣ Update and save user
    user.isEmailVerified = true;
    await user.save();

    // 7️⃣ Success
    return response(true, 200, "Email verified successfully!");
  } catch (error) {
    return catchError(error, "Failed to verify email.");
  }
}
