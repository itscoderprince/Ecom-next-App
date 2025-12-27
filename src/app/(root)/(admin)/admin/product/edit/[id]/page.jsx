"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ADMIN_DASHBOARD,
    ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanel.route";
import axios from "axios";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
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
import slugify from "slugify";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModal from "@/components/Application/Admin/MediaModal";
import Image from "next/image";

const EditProduct = ({ params }) => {
    const { id } = use(params)

    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_PRODUCT_SHOW, label: "Product" },
        { href: "", label: "Edit Product" },
    ];

    const { data: getCategory } = useFetch('/api/category?deleteType=SD&size=1000')
    const { data: getSingleProduct, loading: getProductLoading } = useFetch(`/api/product/get/${id}`)

    // Media modlal states
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    const categoryOption = useMemo(() => {
        if (getCategory && getCategory.success) {
            return getCategory.data.map((cat) => ({ label: cat.name, value: cat._id }));
        }
        return []
    }, [getCategory])

    // zod schema
    const formSchema = zSchema.pick({
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true,
    });

    // React Hook Form Initialization
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
            category: '',
            mrp: 0,
            sellingPrice: 0,
            discountPercentage: 0,
            description: ''
        },
    });

    // set product in form
    useEffect(() => {
        if (getSingleProduct && getSingleProduct.success) {
            const { data } = getSingleProduct
            form.setValue("name", data.name)
            form.setValue("slug", data.slug)
            form.setValue("category", data.category)
            form.setValue("mrp", data.mrp)
            form.setValue("sellingPrice", data.sellingPrice)
            form.setValue("discountPercentage", data.discountPercentage)
            form.setValue("description", data.description)
            if (data.media) {
                const mediaIds = data.media.map((media) => ({
                    _id: media._id,
                    url: media.secure_url,
                }))
                setSelectedMedia(mediaIds)
            }
        }
    }, [getSingleProduct])

    // Discount percentage calculation
    useEffect(() => {
        const mrp = form.watch('mrp');
        const sellingPrice = form.watch('sellingPrice');

        if (mrp && sellingPrice) {
            const discountPercentage = (mrp - sellingPrice) / mrp * 100;
            form.setValue('discountPercentage', Math.round(discountPercentage));
        }
    }, [form.watch('mrp'), form.watch('sellingPrice')]);

    // Editor data
    // Editor data
    const editor = useCallback((event, editor) => {
        const data = editor.getData()
        form.setValue("description", data)
    }, [])

    // Submit handler to update media information
    async function onSubmit(values) {
        try {
            if (selectedMedia.length <= 0) return toast.error('Please Select media.')

            const mediaIds = selectedMedia.map((media) => media._id)
            values.media = mediaIds
            values._id = id

            const { data } = await axios.put(`/api/product/update`, values);
            if (!data.success) {
                toast.error(data.message || "Adding failed");
                return;
            }
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        }
    }

    useEffect(() => {
        const name = form.getValues("name");
        if (name) {
            form.setValue("slug", slugify(name).toLowerCase());
        }
    }, [form.watch("name")]);

    return (
        <div>
            {/* Breadcrumb Navigation */}
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className="font-semibold text-xl">Edit Product</h4>
                </CardHeader>

                <CardContent className="mb-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-5 md:grid-cols-2">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-red-500">*</span> </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Slug Field */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Slug..." readOnly {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Select field */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                options={categoryOption}
                                                selected={field.value}
                                                setSelected={field.onChange}
                                                isMulti={false}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Mrp Field */}
                            <FormField
                                control={form.control}
                                name="mrp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mrp<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mrp..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Selling price Field */}
                            <FormField
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Selling Price..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Discount percentage Field */}
                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Percentage<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Discount Percentage..." {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ck editors Field */}
                            <div className="md:col-span-2">
                                <FormLabel className="mb-2">Description<span className="text-red-500">*</span></FormLabel>
                                {
                                    !getProductLoading &&
                                    <Editor
                                        onChange={editor}
                                        initialData={form.getValues('description')}
                                    />

                                }
                                <FormMessage />
                            </div>


                            <div className="md:col-span-2 border-2 border-dashed rounded p-5 text-center">
                                <MediaModal
                                    open={open}
                                    setOpen={setOpen}
                                    setSelectedMedia={setSelectedMedia}
                                    selectedMedia={selectedMedia}
                                    isMultiple={true}
                                />
                                {
                                    selectedMedia.length > 0 &&
                                    <div className="flex gap-2 justify-center items-center flex-wrap mb-3">
                                        {
                                            selectedMedia.map(media => (
                                                media.url ? (
                                                    <div key={media._id} className="relative h-24 w-24 border rounded overflow-hidden">
                                                        <Image
                                                            src={media.url}
                                                            height={180}
                                                            width={180}
                                                            alt="Selected Media"
                                                            className="size-full object-cover"
                                                        />
                                                    </div>
                                                ) : null
                                            ))
                                        }
                                    </div>
                                }
                                <div onClick={() => setOpen(true)}
                                    className="bg-gray-50 dark:bg-card border w-[120px] mx-auto p-2 cursor-pointer rounded-sm"
                                >
                                    <span className="text-gray-500 dark:text-gray-400">Select Media</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <ButtonLoading
                                type="submit"
                                text="Update Product"
                                variant="default"
                                loading={form.formState.isSubmitting}
                                className="ml-auto mt-2 cursor-pointer"
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    );
};

export default EditProduct;
