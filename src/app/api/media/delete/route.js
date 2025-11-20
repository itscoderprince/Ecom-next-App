import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import { mediaModel } from "@/models/mediaModel";
import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const auth  = await isAuthenticated("admin");
    
    if (!auth.isAuth) return response(false, 403, "Unauthorize.");

    await connectDB();

    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ids list.");
    }

    const media = await mediaModel.find({ _id: { $in: ids } }).lean();
    if (!media.length) return response(false, 400, "Data not found!");

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid deleteType.");
    }

    if (deleteType === "SD") {
      await mediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return response(true, 200, "Data moved into trash.");
    }

    await mediaModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: null } }
    );

    return response(true, 200, "Data restored successfully.");
  } catch (error) {
    
    return catchError(error);
  }
}

export async function DELETE(req) {
  // The transaction logic has been removed to support standalone MongoDB instances
  // common in development. Operations are re-ordered to first delete from
  // Cloudinary, then the database, to prevent orphaned database records.
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorize.");

    await connectDB();

    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ids list.");
    }

    const media = await mediaModel.find({ _id: { $in: ids } }).lean();

    if (!media.length) return response(false, 400, "Data not found!");

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid deleteType.");
    }

    const publicIds = media.map((m) => m.public_id);

    // Step 1: Delete images from Cloudinary.
    // If this fails, we abort before touching the database.
    if (publicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
        return response(
          false,
          500,
          "Failed to delete files from Cloudinary. Database not changed."
        );
      }
    }

    // Step 2: If Cloudinary delete was successful, delete from the database.
    await mediaModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
