import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { couponModel } from "@/models/couponModel";

export async function PUT(req, { params }) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) return response(false, 403, "Unauthorized!");
        await connectDB();

        const { id } = await params;
        const payload = await req.json();

        const validation = zSchema
            .pick({
                code: true,
                discountPercentage: true,
                minShoppingAmount: true,
                validity: true,
            })
            .safeParse(payload);

        if (!validation.success) {
            return response(false, 400, "INVALID_INPUT", validation.error.flatten());
        }
        const { code, discountPercentage, minShoppingAmount, validity } = validation.data;

        const coupon = await couponModel.findOne({
            deletedAt: null,
            _id: id
        });

        if (!coupon) return response(false, 404, "Data not found .");

        coupon.code = code;
        coupon.discountPercentage = discountPercentage;
        coupon.minShoppingAmount = minShoppingAmount;
        coupon.validity = validity;

        await coupon.save();


        return response(true, 201, "Coupon updated successfully");
    } catch (error) {
        return catchError(error);
    }
}
