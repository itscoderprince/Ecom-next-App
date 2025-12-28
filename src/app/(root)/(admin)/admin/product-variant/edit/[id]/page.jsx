"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ADMIN_DASHBOARD,
    ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AdminPanel.route";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { baseSchema, zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";
import { sizes } from "@/lib/utils";

const EditProductVariant = ({ params }) => {
    const { id } = use(params);

    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
        { href: "", label: "Edit Product Variant" },
    ];

    const [productOption, setProductOption] = useState([]);
    const { data: getProduct } = useFetch("/api/product?deleteType=SD&size=1000");
    const { data: getSingleVariant } = useFetch(`/api/product-variant/get/${id}`);

    // Media modal states
    const [open, setOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([]);

    useEffect(() => {
        if (getProduct && getProduct.success) {
            const { data } = getProduct;
            const options = data.map((product) => ({
                label: product.name,
                value: product._id,
            }));
            setProductOption(options);
        }
    }, [getProduct]);

    // zod schema
    const formSchema = baseSchema.pick({
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
    });

    // React Hook Form Initialization
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: "",
            sku: "",
            color: "",
            size: "",
            mrp: 0,
            sellingPrice: 0,
            discountPercentage: 0,
        },
    });

    // Set variant data in form
    useEffect(() => {
        if (getSingleVariant && getSingleVariant.success) {
            const { data } = getSingleVariant;
            form.setValue("product", data.product._id || data.product); // Handle if populated or not
            form.setValue("sku", data.sku);
            form.setValue("color", data.color);
            form.setValue("size", data.size);
            form.setValue("mrp", data.mrp);
            form.setValue("sellingPrice", data.sellingPrice);
            form.setValue("discountPercentage", data.discountPercentage);

            if (data.media) {
                const mediaIds = data.media.map((media) => ({
                    _id: media._id,
                    url: media.secure_url,
                }));
                setSelectedMedia(mediaIds);
            }
        }
    }, [getSingleVariant]);

    // DiscountPercentage calculation
    useEffect(() => {
        const mrp = form.watch("mrp");
        const sellingPrice = form.watch("sellingPrice");

        if (mrp && sellingPrice) {
            const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
            form.setValue("discountPercentage", Math.round(discountPercentage));
        }
    }, [form.watch("mrp"), form.watch("sellingPrice")]);

    // Submit handler
    async function onSubmit(values) {
        try {
            if (selectedMedia.length <= 0) return toast.error("Please Select media.");

            const mediaIds = selectedMedia.map((media) => media._id);
            values.media = mediaIds;
            values._id = id;

            const { data } = await axios.put(`/api/product-variant/update`, values);
            if (!data.success) {
                toast.error(data.message || "Update failed");
                return;
            }

            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        }
    }

    return (
        <div>
            <AdminBreadcrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className="font-semibold text-xl">Edit Product Variant</h4>
                </CardHeader>

                <CardContent className="mb-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=" grid gap-5 md:grid-cols-2"
                        >
                            {/* Product Select field */}
                            <FormField
                                control={form.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Product<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                options={productOption}
                                                selected={field.value}
                                                setSelected={field.onChange}
                                                isMulti={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* SKU Field */}
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            SKU<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter sku..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Color Field */}
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Color<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter color..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Size Field */}
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Size<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                options={sizes}
                                                selected={field.value}
                                                setSelected={field.onChange}
                                                isMulti={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* MRP Field */}
                            <FormField
                                control={form.control}
                                name="mrp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Mrp<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mrp..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Selling Price Field */}
                            <FormField
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Selling Price<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Selling Price..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Discount Percentage Field */}
                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Discount Percentage<span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Discount Percentage..."
                                                {...field}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2 border-2 border-dashed rounded p-5 text-center">
                                <MediaModal
                                    open={open}
                                    setOpen={setOpen}
                                    setSelectedMedia={setSelectedMedia}
                                    selectedMedia={selectedMedia}
                                    isMultiple={true}
                                />
                                {selectedMedia.length > 0 && (
                                    <div className="flex gap-2 justify-center items-center flex-wrap mb-3">
                                        {selectedMedia.map((media) => (
                                            <div
                                                key={media._id}
                                                className="relative h-24 w-24 border rounded overflow-hidden"
                                            >
                                                <Image
                                                    src={media.url}
                                                    height={180}
                                                    width={180}
                                                    alt="Selected Media"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div
                                    onClick={() => setOpen(true)}
                                    className="bg-gray-50 dark:bg-card border w-[120px] mx-auto p-2 cursor-pointer rounded-sm"
                                >
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Select Media
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <ButtonLoading
                                type="submit"
                                text="Update Variant"
                                variant="default"
                                loading={form.formState.isSubmitting}
                                className="ml-auto mt-2 cursor-pointer"
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProductVariant;
