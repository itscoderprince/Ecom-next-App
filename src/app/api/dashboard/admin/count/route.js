import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { CategoryModel } from "@/models/categoryModel";
import { ProductModel } from "@/models/productModel";
import { User } from "@/models/userModel";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");
    await connectDB();

    const [category, product, customer] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      User.countDocuments({ deletedAt: null }),
    ]);

    return response(true, 200, "Dashboard count.", {
      category,
      product,
      customer,
    });
  } catch (error) {
    catchError(error);
  }
}
