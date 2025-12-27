import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { ReviewModel } from "@/models/reviewModel";

export async function PUT(req) {
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

    const review = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!review.length) return response(false, 400, "Review not found!");

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid deleteType.");
    }

    if (deleteType === "SD") {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } },
      );
      return response(true, 200, "Data moved into trash.");
    }

    await ReviewModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: null } },
    );
    return response(true, 200, "Data restored successfully.");
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(req) {
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

    const review = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!review.length) return response(false, 400, "Review not found!");

    if (deleteType !== "PD") return response(false, 400, "Invalid deleteType.");

    await ReviewModel.deleteMany({ _id: { $in: ids } });
    return response(true, 200, "Review deleted permanently.");
  } catch (error) {
    return catchError(error);
  }
}
