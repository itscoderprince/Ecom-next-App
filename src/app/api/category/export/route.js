import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { CategoryModel } from "@/models/categoryModel";
import { isValidObjectId } from "mongoose";

export async function GET(req) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) response(false, 403, "Unauthorize!");

        await connectDB();

        const filter = { deletedAt: null };
        const getCategory = await CategoryModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getCategory) return response(false, 404, "Data not found!")


        return response(true, 200, "Data found!", getCategory)


    } catch (error) {
        return catchError(error);
    }
}
