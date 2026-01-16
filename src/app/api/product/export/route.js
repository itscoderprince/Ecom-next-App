import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { ProductModel } from "@/models/productModel";

export async function GET(req) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) response(false, 403, "Unauthorize!");

        await connectDB();

        const filter = { deletedAt: null };
        const getProduct = await ProductModel.find(filter).select('-media -description').sort({ createdAt: -1 }).lean()
        if (!getProduct) return response(false, 404, "Data not found!")


        return response(true, 200, "Data found!", getProduct)


    } catch (error) {
        return catchError(error);
    }
}
