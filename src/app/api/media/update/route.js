import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { mediaModel } from "@/models/mediaModel";
import { zSchema } from "@/lib/zodSchema"; // FIXED: missing import
import { isAuthenticated } from "@/lib/authentication";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await connectDB();

    // -------------------- VALIDATION --------------------
    const payload = await req.json();

    const validation = zSchema
      .pick({ _id: true, title: true, alt: true })
      .safeParse(payload);

    if (!validation.success) {
      return response(
        false,
        400,
        "INVALID_INPUT",
        validation.error.flatten()
      );
    }

    const { _id, title, alt } = validation.data;

    if (!_id) return response(false, 400, "Media ID is required");

    const media = await mediaModel.findById(_id);
    if (!media) return response(false, 404, "Media not found");

    media.alt = alt;
    media.title = title;

    await media.save();

    return response(true, 200, "Media updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
