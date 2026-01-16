import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, successResponse } from "@/lib/helperFunction";
import { CategoryModel } from "@/models/categoryModel";

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

        // Global and column filters
        if (globalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } }
            ]
        }

        if (filters.length > 0) {
            filters.forEach((filter) => {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            })
        }

        // Sorting configuration
        let sortQuery = {}
        if (sorting.length > 0) {
            sorting.forEach((sort) => {
                sortQuery[sort.id] = sort.desc ? -1 : 1
            })
        }

        // Category listing pipeline
        const pipeline = [
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deleteType: 1
                }
            }
        ]

        const [getCategory, totalRowCount] = await Promise.all([
            CategoryModel.aggregate(pipeline),
            CategoryModel.countDocuments(matchQuery)
        ]);

        return successResponse('Category list fetched successfully', getCategory, 200, { totalRowCount });

    } catch (error) {
        return catchError(error)
    }
}
