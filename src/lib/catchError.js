import { response } from "./helperFunction";

/**
 * Centralized production error handler
 * Covers ~95% real-world ecommerce errors
 */
export const catchError = (error, customMessage) => {
  const name = error?.name || "Error";
  const message = error?.message || "";
  const code = error?.code;

  /* ---------------------------------
     🟣 ZOD / VALIDATION ERRORS
  ---------------------------------- */
  if (name === "ZodError") {
    const errors = error.flatten().fieldErrors;
    return response({
      success: false,
      status: 400,
      message: "Validation failed",
      data: errors,
    });
  }

  /* ---------------------------------
     🟣 MONGOOSE ERRORS
  ---------------------------------- */

  // Validation
  if (name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map((e) => e.message);
    return response({
      success: false,
      status: 400,
      message: errors.join(", "),
    });
  }

  // Duplicate key
  if (code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return response({
      success: false,
      status: 400,
      message: `${field} already exists`,
    });
  }

  // Invalid ObjectId
  if (name === "CastError") {
    return response({
      success: false,
      status: 400,
      message: `Invalid ${error.path}`,
    });
  }

  /* ---------------------------------
     🟣 DATABASE / NETWORK
  ---------------------------------- */
  const dbErrors = [
    "MongoServerSelectionError",
    "MongooseServerSelectionError",
    "MongoNetworkError",
  ];

  if (
    dbErrors.includes(name) ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT") ||
    message.includes("SSL") ||
    message.includes("tls")
  ) {
    return response({
      success: false,
      status: 503,
      message: "Database service unavailable. Please try again later.",
    });
  }

  /* ---------------------------------
     🟣 AUTH / JWT
  ---------------------------------- */
  if (name === "JsonWebTokenError") {
    return response({
      success: false,
      status: 401,
      message: "Invalid session. Please login again.",
    });
  }

  if (name === "TokenExpiredError") {
    return response({
      success: false,
      status: 401,
      message: "Session expired. Please login again.",
    });
  }

  /* ---------------------------------
     🟣 EXTERNAL SERVICES (PAYMENT / MAIL)
  ---------------------------------- */
  if (message.includes("Stripe") || message.includes("Razorpay")) {
    return response({
      success: false,
      status: 502,
      message: "Payment service unavailable. Please try again.",
    });
  }

  if (message.includes("SMTP") || message.includes("Mail")) {
    return response({
      success: false,
      status: 502,
      message: "Email service unavailable. Please try later.",
    });
  }

  /* ---------------------------------
     🟣 CUSTOM APP ERRORS
  ---------------------------------- */
  if (error?.status && error?.isOperational) {
    return response({
      success: false,
      status: error.status,
      message: error.message,
    });
  }

  /* ---------------------------------
     🔴 FINAL FALLBACK (SAFE)
  ---------------------------------- */
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ UNHANDLED ERROR:", error);
  }

  return response({
    success: false,
    status: 500,
    message: customMessage || "Something went wrong. Please try again later.",
  });
};
