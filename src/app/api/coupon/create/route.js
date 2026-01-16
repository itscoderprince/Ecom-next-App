import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { couponModel } from "@/models/couponModel";

export async function POST(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

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

    const newProduct = new couponModel({ code, discountPercentage, minShoppingAmount, validity });
    await newProduct.save();

    return response(true, 200, "Coupon Created successfully");
  } catch (error) {
    return catchError(error);
  }
}
