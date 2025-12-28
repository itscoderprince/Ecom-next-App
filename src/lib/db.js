import mongoose from "mongoose";

/**
 * Handles MongoDB connection with a caching mechanism for Next.js hot-reloading.
 * Prevents multiple active connections in development environments.
 */

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "Next-Ecom_app",
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;

  return cached.conn;
};
