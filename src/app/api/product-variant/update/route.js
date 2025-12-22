import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { ProductModel } from "@/models/productModel";
import { encode } from "entities";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({
        _id: true,
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
    const { _id, name, slug, category, mrp, sellingPrice, discountPercentage, description, media } = validation.data;

    const getProduct = await ProductModel.findOne({
      deletedAt: null,
      _id
    });

    if (!getProduct) return response(false, 404, "Data not found .");

    getProduct.name = name
    getProduct.slug = slug
    getProduct.category = category
    getProduct.mrp = mrp
    getProduct.sellingPrice = sellingPrice
    getProduct.discountPercentage = discountPercentage
    getProduct.description = encode(description)
    getProduct.media = media
    await getProduct.save()


    return response(true, 201, "Product updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
