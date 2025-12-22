import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import { ProductModel } from "@/models/productModel";
import { mediaModel } from "@/models/mediaModel";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) response(false, 403, "Unauthorize!");

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) return response(false, 403, "Invalid object ID!");

    const filter = { _id: id, deletedAt: null };

    const getProduct = await ProductModel.findOne(filter).populate('media', '_id secure_url').lean();
    if (!getProduct) response(false, 404, "Product not found!");
    return response(true, 200, "Product found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
