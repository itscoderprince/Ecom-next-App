import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { ProductModel } from "@/models/productModel";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return catchError({ status: 403, message: 'Unauthorized access.' });
        }

        await connectDB()

        const searchParams = request.nextUrl.searchParams
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilter') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType')

        // Build match query
        let matchQuery = {}

        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // Global filter logic
        if (globalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
                { 'categoryData.name': { $regex: globalFilter, $options: 'i' } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$mrp" },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$sellingPrice" },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$discountPercentage" },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
            ]
        }

        // Column specific filter logic
        if (filters.length > 0) {
            filters.forEach((filter) => {
                if (filter.id === 'category') {
                    matchQuery['categoryData.name'] = { $regex: filter.value, $options: 'i' }
                } else if (['mrp', 'sellingPrice', 'discountPercentage'].includes(filter.id)) {
                    if (!matchQuery['$and']) matchQuery['$and'] = []
                    matchQuery['$and'].push({
                        $expr: {
                            $regexMatch: {
                                input: { $toString: `$${filter.id}` },
                                regex: filter.value,
                                options: 'i'
                            }
                        }
                    })
                } else {
                    matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
                }
            })
        }

        // Sorting logic
        let sortQuery = {}
        if (sorting.length > 0) {
            sorting.forEach((sort) => {
                const column = sort.id === 'category' ? 'categoryData.name' : sort.id
                sortQuery[column] = sort.desc ? -1 : 1
            })
        }

        // Aggregation pipeline for product listing with category info
        const pipeline = [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $unwind: {
                    path: '$categoryData',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    category: '$categoryData.name',
                    createdAt: 1,
                    updatedAt: 1,
                    deleteType: 1
                }
            }
        ]

        const [getProduct, totalRowCount] = await Promise.all([
            ProductModel.aggregate(pipeline),
            ProductModel.countDocuments(matchQuery)
        ]);

        return successResponse('Product list fetched successfully', getProduct, 200, { totalRowCount });

    } catch (error) {
        return catchError(error)
    }
}
