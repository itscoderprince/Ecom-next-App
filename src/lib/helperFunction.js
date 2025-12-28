import { NextResponse } from "next/server";
import { SignJWT } from "jose";

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a JWT token for email verification
 */
export const generateVerifyToken = async (userId) => {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not configured.");
  }
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  return await new SignJWT({
    uid: userId.toString(),
    type: "email-verification",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .setIssuedAt()
    .sign(secret);
};

/**
 * UTILITY HELPERS
 * This file contains reusable functions for API responses, error handling, 
 * and common data formatting tasks.
 */

/**
 * Standardize successful API responses
 */
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

/**
 * Clean success response wrapper
 */
export const successResponse = (message = "Success", data = {}, status = 200) => {
  return response(true, status, message, data);
};

/**
 * Centralized error handler for API routes
 */
export const catchError = (
  error,
  customMessage = ""
) => {
  const errName = String(error?.name || "");
  const errMessage = String(error?.message || "");
  const errString = String(error || "");

  console.log("🔍 DEBUG: Entering catchError with:", { name: errName, message: errMessage.substring(0, 50) });

  // 1. SSL / IP Whitelist / Network Errors (Move to TOP)
  if (
    errName.includes("MongoServerSelectionError") ||
    errName.includes("MongooseServerSelectionError") ||
    errName.includes("MongoNetworkError") ||
    errMessage.includes("tlsv1 alert internal error") ||
    errMessage.includes("SSL alert") ||
    errString.includes("MongoServerSelectionError") ||
    errString.includes("MongooseServerSelectionError") ||
    errString.includes("MongoNetworkError")
  ) {
    console.error("🚨 CRITICAL: MongoDB access blocked by IP Whitelist or SSL error.");
    return response(false, 503, "Database access denied. Please ensure your IP address is whitelisted in MongoDB Atlas (Network Access).");
  }

  // Mongoose Validation Error
  if (error && error.name === "ValidationError") {
    const message = Object.values(error.errors).map(val => val.message).join(', ');
    return response(false, 400, message || "Validation failed.");
  }

  // Mongoose Duplicate Key Error
  if (error && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return response(false, 400, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`);
  }

  // Mongoose Cast Error (Invalid ID)
  if (error && error.name === "CastError") {
    return response(false, 400, `Invalid ${error.path}: ${error.value}`);
  }

  // JWT Errors
  if (error && error.name === "JsonWebTokenError") {
    return response(false, 401, "Invalid session. Please log in again.");
  }

  if (error && error.name === "TokenExpiredError") {
    return response(false, 401, "Session expired. Please log in again.");
  }

  // Database Connection Errors
  const connectionErrors = ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT"];
  if (error && error.code && connectionErrors.includes(error.code)) {
    return response(false, 503, "Database connection failed. Please check your network or connection string.");
  }

  if (error && error.message && (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND"))) {
    return response(false, 503, "Database connection timeout or DNS failure.");
  }

  // MongoDB Authentication Error
  if (error && error.message && error.message.includes("bad auth")) {
    return response(false, 500, "Database authentication failed. Please check your MONGODB_URI in the .env file.");
  }

  // Fallback to custom message or generic internal error
  const finalMessage = customMessage || (error && error.message) || "Something went wrong. Please try again later.";

  if (!customMessage && (!error || !error.message)) {
    console.error("🔍 DEBUG: catchError fallback hit. Raw error:", error);
  } else if (error) {
    console.error("❌ API Error [", error.name || "Default", "]:", error.message);
  }

  return response(false, (error && error.status) || 500, finalMessage);
};

/**
 * Format currency to INR (Indian Rupee)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format string to slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

/**
 * Clean up object by removing undefined/null values
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

/**
 * Standardize table column config helpers
 */
export const columnConfig = (
  column,
  options = { isCreatedAt: false, isUpdatedAt: false, isDeletedAt: false }
) => {
  const newColumn = [...column];

  const dateFormater = ({ cell }) => (new Date(cell.getValue()).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  if (options.isCreatedAt) {
    newColumn.push({
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: dateFormater
    });
  }
  if (options.isUpdatedAt) {
    newColumn.push({
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: dateFormater
    });
  }
  if (options.isDeletedAt) {
    newColumn.push({
      accessorKey: 'deletedAt',
      header: 'Deleted At',
      cell: dateFormater
    });
  }
  return newColumn;
};
