import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { isAuthenticated, response, catchError } from "@/lib/helperFunction";
import { mediaModel } from "@/models/mediaModel";

export async function POST(req) {
  let payload = [];

  try {
    const body = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));
    
    payload = Array.isArray(body?.files) ? body.files : [];
    console.log("Extracted payload:", JSON.stringify(payload, null, 2));
    

    if (payload.length === 0) {
      console.error("Empty payload received");
      return response(false, 400, "Invalid media payload. No files provided.");
    }

    // Validate required fields before proceeding
    const missingFields = payload.some((file) => {
      return !file.asset_id || !file.public_id || !file.path || !file.thumbnail_url;
    });

    if (missingFields) {
      console.error("Missing required fields in payload:", payload);
      return response(false, 400, "Missing required fields: asset_id, public_id, path, or thumbnail_url");
    }

    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      console.error("Unauthorized access attempt");
      return response(false, 403, "Unauthorized!");
    }

    await connectDB();
    console.log("Database connected, inserting media...");

    const savedMedia = await mediaModel.insertMany(payload);
    console.log("Media saved successfully:", savedMedia.length, "items");

    return response(true, 200, "Media uploaded successfully.", savedMedia);
  } catch (error) {
    console.error("Media Save Error:", error);

    if (Array.isArray(payload) && payload.length > 0) {
      const publicIds = payload
        .map((data) => data.public_id)
        .filter(Boolean);
      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
        } catch (deleteError) {
          console.error("Cloudinary cleanup error:", deleteError);
          error.cloudinaryCleanupError = deleteError;
        }
      }
    }

    return catchError(error);
  }
}
