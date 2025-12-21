import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { ProductModel } from "@/models/productModel";

export async function POST(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true,
        media: true
      })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const { name, slug, category, mrp, sellingPrice, discountPercentage, description, media } = validation.data;

    const existingProduct = await ProductModel.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }],
    });

    if (existingProduct) {
      return response(
        false,
        400,
        "Product with this name or slug already exists."
      );
    }

    const newProduct = new ProductModel({ name, slug, category, mrp, sellingPrice, discountPercentage, description, media });
    await newProduct.save();

    return response(true, 200, "Product added successfully");
  } catch (error) {
    return catchError(error);
  }
}
