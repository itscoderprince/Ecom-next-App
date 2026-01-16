import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { ProductVariantModel } from "@/models/productVariantModel";
import { zSchema } from "@/lib/zodSchema";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized!");

    await connectDB();

    const payload = await req.json();
    const validation = zSchema
      .pick({
        _id: true,
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
      _id,
      product,
      sku,
      color,
      size,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    } = validation.data;

    const variant = await ProductVariantModel.findOne({
      deletedAt: null,
      _id,
    });

    if (!variant) return response(false, 404, "Data not found .");

    variant.product = product;
    variant.sku = sku;
    variant.color = color;
    variant.size = size;
    variant.mrp = mrp;
    variant.sellingPrice = sellingPrice;
    variant.discountPercentage = discountPercentage;
    variant.media = media;
    await variant.save();

    return response(true, 201, "Product variant updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
