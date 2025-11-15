// api/auth/verify-email.js
import { connectDB } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not provided" },
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload.userId);

    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );

    user.isEmailVerified = true;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Invalid or expired token",
      },
      { status: 400 }
    );
  }
}
