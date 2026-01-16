import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { mediaModel } from "@/models/mediaModel";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) response(false, 403, "Unauthorize!");

    await connectDB();

    const getParams = await params;
    const id = getParams.id;

    const filter = { deletedAt: null };
    if (!isValidObjectId(id)) response(false, 403, "Invalid object ID!");
    filter._id = id;

    const getMedia = await mediaModel.findOne(filter).lean();
    if (!getMedia) response(false, 404, "Media not found!");
    return response(true, 200, "Media found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
