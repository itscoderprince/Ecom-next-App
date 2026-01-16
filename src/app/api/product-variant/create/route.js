import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { ProductVariantModel } from "@/models/productVariantModel";

export async function POST(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        media: true,
      })
      .safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "INVALID_INPUT", validation.error.flatten());
    }

    const {
      product,
      color,
      size,
      sku,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    } = validation.data;

    const newProductVariant = new ProductVariantModel({
      product,
      sku,
      color,
      size,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    });
    await newProductVariant.save();

    return response(true, 200, "Product variant added successfully");
  } catch (error) {
    return catchError(error);
  }
}
