import { connectDB } from "@/lib/db";
import { response, catchError } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { OtpModel } from "@/models/otpModel";
import { User } from "@/models/userModel";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // ✅ 1. Validate input
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing input fields", error: validateData.error },
        { status: 400 }
      );
    }

    const { email, otp } = validateData.data;

    // ✅ 2. Check OTP record
    const getOtpData = await OtpModel.findOne({ email, otp });
    if (!getOtpData) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 404 }
      );
    }

    // ✅ 3. Get User
    const getUser = await User.findOne({ deletedAt: null, email });
    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ 4. Create JWT
    const loggedInUserData = {
      _id: getUser._id.toString(),
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") 
      .sign(secret);

    // ✅ 5. Delete OTP record
    await getOtpData.deleteOne();

    // ✅ 6. Create NextResponse and set cookie
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      data: loggedInUserData,
    });

    res.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // ✅ 7. Return response with cookie
    return res;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
