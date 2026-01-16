import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { ReviewModel } from "@/models/reviewModel";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) response(false, 403, "Unauthorize!");
    await connectDB();

    const filter = { deletedAt: null };

    const getReview = await ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    if (!getReview) return response(false, 404, "Review not found!");

    return response(true, 200, "Review found!", getReview);
  } catch (error) {
    return catchError(error);
  }
}
