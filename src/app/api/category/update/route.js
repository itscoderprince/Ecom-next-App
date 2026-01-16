import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { CategoryModel } from "@/models/categoryModel";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({ _id: true, name: true, slug: true })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { _id, name, slug } = validation.data;

    const getCategory = await CategoryModel.findOne({
      deletedAt: null,
      _id
    });

    if (!getCategory) {
      return response(
        false,
        404,
        "Data not found ."
      );
    }
    getCategory.name = name
    getCategory.slug = slug
    await getCategory.save()


    return response(true, 201, "Category updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
