import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        requred: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    mrp: {
        type: Number,
        requred: true,
    },
    sellingPrice: {
        type: Number,
        requred: true,
    },
    discountPercentage: {
        type: Number,
        requred: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
        }
    ],
    description: {
        type: String,
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })


ProductSchema.index({ category: 1 })

export const ProductModel =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);