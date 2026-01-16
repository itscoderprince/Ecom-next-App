import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { couponModel } from "@/models/couponModel";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return catchError({ status: 403, message: "Unauthorized access." });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // Build match query
    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // Global filter logic
    if (globalFilter) {
      matchQuery["$or"] = [
        { code: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    // Column specific filter logic
    if (filters.length > 0) {
      filters.forEach((filter) => {
        if (["minShoppingAmount", "discountPercentage"].includes(filter.id)) {
          matchQuery[filter.id] = Number(filter.value);
        } else if (filter.id === "validity") {
          matchQuery[filter.id] = new Date(filter.value);
        } else {
          matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
        }
      });
    }

    // Sorting logic
    let sortQuery = {};
    if (sorting.length > 0) {
      sorting.forEach((sort) => {
        sortQuery[sort.id] = sort.desc ? -1 : 1;
      });
    }

    // Aggregation pipeline for coupon listing
    const pipeline = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          discountPercentage: 1,
          minShoppingAmount: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deleteType: 1,
        },
      },
    ];

    const [getCoupon, totalRowCount] = await Promise.all([
      couponModel.aggregate(pipeline),
      couponModel.countDocuments(matchQuery)
    ]);

    return successResponse("Coupon list fetched successfully", getCoupon, 200, { totalRowCount });

  } catch (error) {
    return catchError(error);
  }
}
