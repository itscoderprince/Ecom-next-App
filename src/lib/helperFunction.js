import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const response = (success, status = 200, message = "", data = {}) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
};

export const catchError = (
  error,
  customMessage = "Something went wrong. Please try again later."
) => {
  console.error("❌ Error caught:", error);

  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Server error. Please try again later.",
    };
  }

  if (error.name === "ValidationError") {
    const message =
      error.message || "Some fields are not valid. Please check your input.";
    return response(false, 400, message);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `The ${field} you entered already exists. Please use a different one.`;
    return response(false, 400, message);
  }

  if (error.name === "CastError") {
    return response(
      false,
      400,
      `Invalid ${error.path}. Please provide a correct value.`
    );
  }

  if (error.name === "JsonWebTokenError") {
    return response(
      false,
      401,
      "Your login session is invalid. Please log in again."
    );
  }

  if (error.name === "TokenExpiredError") {
    return response(
      false,
      401,
      "Your session has expired. Please log in again."
    );
  }

  if (error.message && error.message.includes("ECONNREFUSED")) {
    return response(
      false,
      503,
      "Unable to connect to the server. Please try again later."
    );
  }

  if (customMessage) {
    return response(false, 500, customMessage);
  }

  return response(
    false,
    500,
    error.message || "Unexpected server error. Please try again later."
  );
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const isAuthenticated = async (role) => {
  try {
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not configured.");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { isAuth: false, error: "TOKEN_NOT_FOUND" };
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    if (role && payload.role !== role) {
      return { isAuth: false, error: "ROLE_NOT_ALLOWED" };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
    };
  } catch (error) {
    console.error("isAuthenticated error:", error);
    return { isAuth: false, error };
  }
};
