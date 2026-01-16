import { jwtVerify } from "jose";
import { catchError } from "@/lib/catchError";
import { UserModel } from "@/models/userModel";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await dbConnect();

    const { token } = await request.json();

    if (!token) {
      return response({
        success: false,
        status: 400,
        message: "Verification token is missing.",
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("Server configuration missing (SECRET_KEY)");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    // -------- Verify JWT --------
    let payload;
    try {
      const verified = await jwtVerify(token, secret, {
        issuer: "panda-bee-auth",
        audience: "email-verification",
      });
      payload = verified.payload;
    } catch {
      return response({
        success: false,
        status: 400,
        message: "The verification link is invalid or has expired.",
      });
    }

    // -------- Validate token type --------
    if (payload.type !== "email-verification") {
      return response({
        success: false,
        status: 400,
        message: "Invalid verification token.",
      });
    }

    const userId = payload.sub;

    const user = await UserModel.findById(userId).select("+isEmailVerified");
    if (!user) {
      return response({
        success: false,
        status: 404,
        message: "Associated user not found.",
      });
    }

    if (user.isEmailVerified) {
      return response({
        success: true,
        status: 200,
        message: "Your email is already verified.",
        data: { verified: true },
      });
    }

    user.isEmailVerified = true;
    await user.save();

    return response({
      success: true,
      status: 200,
      message: "Email verified successfully!",
      data: { verified: true },
    });
  } catch (error) {
    return catchError(error);
  }
}
