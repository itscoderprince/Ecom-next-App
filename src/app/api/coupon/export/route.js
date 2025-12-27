import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { couponModel } from "@/models/couponModel";
import { ProductModel } from "@/models/productModel";

export async function GET(req) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) response(false, 403, "Unauthorize!");
        await connectDB();

        const filter = { deletedAt: null };

        const getCoupon = await couponModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getCoupon) return response(false, 404, "Coupon not found!")

        return response(true, 200, "Coupon found!", getCoupon)
    } catch (error) {
        return catchError(error);
    }
}
