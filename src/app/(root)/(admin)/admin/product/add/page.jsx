"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ADMIN_DASHBOARD,
    ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanel.route";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModal from "@/components/Application/Admin/MediaModal";
import { FileText, IndianRupee, Layers, Link, Percent } from "lucide-react";
import Image from "next/image";

const AddProduct = () => {
    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_PRODUCT_SHOW, label: "Product" },
        { href: "", label: "Add Product" },
    ];

    const [categoryOption, setCategoryOption] = useState([])
    const { data: getCategory } = useFetch('/api/category?deleteType=SD&size=1000')

    // Media modlal states
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(() => {
        if (getCategory && getCategory.success) {
            const { data } = getCategory;
            const options = data.map((cat) => ({ label: cat.name, value: cat._id }));
            setCategoryOption(options)
        }
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

    useEffect(() => {
        const mrp = form.watch('mrp');
        const sellingPrice = form.watch('sellingPrice');

        if (mrp && sellingPrice) {
            const discountPercentage = (mrp - sellingPrice) / mrp * 100;
            form.setValue('discountPercentage', Math.round(discountPercentage));
        }
    }, [form.watch('mrp'), form.watch('sellingPrice')]);

    // Editor data
    const editor = (event, editor) => {
        const data = editor.getData()
        form.setValue("description", data)
    }

    // Submit handler to update media information
    async function onSubmit(values) {
        try {
            if (selectedMedia.length <= 0) return toast.error('Please Select media.')

            const mediaIds = selectedMedia.map((media) => media._id)
            values.media = mediaIds

            const { data } = await axios.post(`/api/product/create`, values);
            if (!data.success) {
                toast.error(data.message || "Adding failed");
                return;
            }

            form.reset()
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
            <AdminBreadcrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className="font-semibold text-xl">Add Product</h4>
                </CardHeader>

                <CardContent className="mb-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-red-500">*</span> </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Enter name..." {...field} className="pl-9" />
                                            </div>
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
                                            <div className="relative">
                                                <Link className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Slug..." readOnly {...field} className="pl-9" />
                                            </div>
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
                                            <div className="relative">
                                                <Layers className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                                <Select
                                                    options={categoryOption}
                                                    selected={field.value}
                                                    setSelected={field.onChange}
                                                    isMulti={false}
                                                    className="pl-9"
                                                />
                                            </div>
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
                                            <div className="relative">
                                                <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Mrp..." {...field} className="pl-9" />
                                            </div>
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
                                            <div className="relative">
                                                <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Selling Price..." {...field} className="pl-9" />
                                            </div>
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
                                            <div className="relative">
                                                <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Discount Percentage..." {...field} readOnly className="pl-9" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ck editors Field */}
                            <div className="md:col-span-2">
                                <FormLabel className="mb-2">Description<span className="text-red-500">*</span></FormLabel>
                                <Editor
                                    onChange={editor}
                                />
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
                                                <div key={media._id} className="relative h-24 w-24 border rounded overflow-hidden">
                                                    <Image
                                                        src={media.url}
                                                        height={180}
                                                        width={180}
                                                        alt="Selected Media"
                                                        className="size-full object-cover"
                                                    />
                                                </div>
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
                            <div className="flex justify-end col-span-2">
                                <ButtonLoading
                                    type="submit"
                                    text="Add Product"
                                    variant="default"
                                    loading={form.formState.isSubmitting}
                                    className="ml-auto mt-2 cursor-pointer"
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    );
};

export default AddProduct;
