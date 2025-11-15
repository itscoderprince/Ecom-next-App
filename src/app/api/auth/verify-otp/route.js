// api/auth/verify-otp.js
import { connectDB } from "@/lib/db";
import { zSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validation = zSchema.pick({ email: true, otp: true }).safeParse(payload);

    if (!validation.success)
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });

    const { email, otp } = validation.data;

    const otpRecord = await OtpModel.findOne({ email, otp });
    if (!otpRecord)
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 404 });

    const user = await User.findOne({ email, deletedAt: null });
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    const payloadData = {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(payloadData)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    await otpRecord.deleteOne();

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      data: payloadData,
    });

    res.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
