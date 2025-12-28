import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { ReviewModel } from "@/models/reviewModel";

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
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column specific filter logic
    if (filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.id === "product") {
          matchQuery["productData.name"] = { $regex: filter.value, $options: "i" };
        } else if (filter.id === "user") {
          matchQuery["userData.name"] = { $regex: filter.value, $options: "i" };
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

    // Aggregation pipeline for review listing with product and user info
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          user: "$userData.name",
          rating: 1,
          review: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          deleteType: 1,
        },
      },
    ];

    const [getReview, totalRowCount] = await Promise.all([
      ReviewModel.aggregate(pipeline),
      ReviewModel.countDocuments(matchQuery)
    ]);

    return successResponse("Review list fetched successfully", getReview, 200, { totalRowCount });

  } catch (error) {
    return catchError(error);
  }
}
