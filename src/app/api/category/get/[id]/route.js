import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { CategoryModel } from "@/models/categoryModel";
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

    const getCategory = await CategoryModel.findOne(filter).lean();
    if (!getCategory) response(false, 404, "Category not found!");
    return response(true, 200, "Category found", getCategory);
  } catch (error) {
    return catchError(error);
  }
}
