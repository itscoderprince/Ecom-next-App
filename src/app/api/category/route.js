import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { response } from "@/lib/helperFunction";
import { CategoryModel } from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) return response(false, 403, 'Unauthorized.')

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

        // Global filter
        if (globalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } }
            ]
        }

        // Column filter
        if (filters.length > 0) {
            filters.forEach((filter) => {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            })
        }

        // Sorting
        let sortQuery = {}
        if (sorting.length > 0) {
            sorting.forEach((sort) => {
                sortQuery[sort.id] = sort.desc ? -1 : 1
            })
        }

        // Aggregation pipeline
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

        // Execute query
        const getCategory = await CategoryModel.aggregate(pipeline)

        // Get total row count
        const totalRowCount = await CategoryModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            message: 'Category list',
            data: getCategory,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
} 