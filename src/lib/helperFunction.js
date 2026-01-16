import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Response
export const response = ({
  success,
  status = 200,
  message = "Success",
  data = null,
}) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status },
  );
};

// Generate Verify Token
export const generateVerifyToken = async (userId) => {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not configured.");
  }
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  return await new SignJWT({
    type: "email-verification",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId.toString())
    .setIssuer("panda-bee-auth")
    .setAudience("email-verification")
    .setIssuedAt()
    .setExpirationTime(process.env.EMAIL_VERIFY_TOKEN_EXPIRY || "1h")
    .sign(secret);
};

export const isAuthenticated = async (role = null) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { isAuth: false };
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || typeof decoded !== "object") {
      return { isAuth: false };
    }
    if (role && decoded.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      user: decoded,
    };
  } catch (error) {
    console.error("Auth Verification Error:", error.message);
    return { isAuth: false };
  }
};
