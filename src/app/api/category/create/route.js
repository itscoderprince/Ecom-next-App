import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { CategoryModel } from "@/models/categoryModel";

export async function POST(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");
    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({ name: true, slug: true })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { name, slug } = validation.data;

    const existingCategory = await CategoryModel.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }],
    });

    if (existingCategory) {
      return response(
        false,
        400,
        "Category with this name or slug already exists."
      );
    }

    const newCategory = new CategoryModel({ name, slug });
    await newCategory.save();

    return response(true, 200, "Category added successfully");
  } catch (error) {
    return catchError(error);
  }
}
