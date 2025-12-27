import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import { couponModel } from "@/models/couponModel";
import { mediaModel } from "@/models/mediaModel";

export async function GET(_, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) response(false, 403, "Unauthorize!");
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return response(false, 403, "Invalid object ID!");

    const filter = { _id: id, deletedAt: null };

    const getCoupon = await couponModel.findOne(filter).lean();

    if (!getCoupon) response(false, 404, "Coupon not found!");
    return response(true, 200, "Coupon found", getCoupon);
  } catch (error) {
    return catchError(error);
  }
}
