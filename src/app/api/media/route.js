import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { mediaModel as Media } from "@/models/mediaModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 0;
    const deleteType = searchParams.get("deleteType");

    let filter = {};
    if (deleteType === "SD") {
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    const mediaData = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
    const totalMedia = await Media.countDocuments(filter);

    return NextResponse.json({
      mediaData: mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });

  } catch (error) {
    return catchError(error);
  }
}
