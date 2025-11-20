import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { catchError, response, isAuthenticated } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "UNAUTHORIZED");
    const { paramsToSign } = await request.json();

    if (!paramsToSign) return response(false, 400, "MISSING_PARAMS");

    if (!process.env.CLOUDINARY_API_SECRET)
      return response(false, 500, "CLOUDINARY_SECRET_MISSING");

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature });
  } catch (error) {
    return catchError(error);
  }
}
