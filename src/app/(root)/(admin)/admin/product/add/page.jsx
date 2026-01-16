"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    FileText,
    IndianRupee,
    Layers,
    Link2,
    Percent,
    PlusCircle,
    ImageIcon,
    Palette,
    Ruler,
    Tag,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModal from "@/components/Application/Admin/MediaModal";

import { baseSchema } from "@/lib/zodSchema";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanel.route";

const AddProduct = () => {
    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_PRODUCT_SHOW, label: "Product" },
        { href: "", label: "Add Product" },
    ];

    const [categoryOption, setCategoryOption] = useState([]);
    const { data: getCategory } = useFetch('/api/category?deleteType=SD&size=1000');
    const [open, setOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([]);

    const form = useForm({
        resolver: zodResolver(baseSchema.pick({
            name: true, slug: true, category: true, mrp: true,
            sellingPrice: true, discountPercentage: true, description: true,
        })),
        defaultValues: {
            name: '', slug: '', category: '', mrp: 0,
            sellingPrice: 0, discountPercentage: 0, description: '',
            color: '', size: ''
        },
    });

    const watchedName = form.watch("name");
    const watchedMrp = form.watch("mrp");
    const watchedSellingPrice = form.watch("sellingPrice");

    useEffect(() => {
        if (watchedName) {
            form.setValue("slug", slugify(watchedName, { lower: true, strict: true }));
        }
    }, [watchedName]);

    useEffect(() => {
        const mrpNum = Number(watchedMrp);
        const spNum = Number(watchedSellingPrice);
        if (mrpNum > 0 && spNum > 0) {
            const discount = ((mrpNum - spNum) / mrpNum) * 100;
            form.setValue('discountPercentage', Math.max(0, Math.round(discount)));
        }
    }, [watchedMrp, watchedSellingPrice]);

    useEffect(() => {
        if (getCategory?.success) {
            const options = getCategory.data.map((cat) => ({ label: cat.name, value: cat._id }));
            setCategoryOption(options);
        }
    }, [getCategory]);

    async function onSubmit(values) {
        try {
            if (selectedMedia.length <= 0) return toast.error('Please select media.');
            values.media = selectedMedia.map((m) => m._id);
            const { data } = await axios.post(`/api/product/create`, values);
            if (data.success) {
                form.reset();
                setSelectedMedia([]);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6 pb-10">
            <div className="px-2 sm:px-0">
                <AdminBreadcrumb breadcrumbData={breadcrumbData} />
            </div>

            <Card className="rounded-md shadow-sm border-x-0 sm:border-x py-0 gap-3">
                {/* Header matches Category page exactly */}
                <CardHeader className="pt-3 px-3 sm:px-6 border-b [.border-b]:pb-5 flex flex-row items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-muted-foreground" />
                    <h4 className="font-semibold text-lg sm:text-xl">Add Product</h4>
                </CardHeader>

                <CardContent className="px-3 sm:px-6 py-4 sm:py-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                            {/* Row 1: Name & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Tag className="w-4 h-4 text-muted-foreground" /> Product Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter name..." {...field} className="h-10 sm:h-11 focus-visible:ring-primary text-sm" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Link2 className="w-4 h-4" /> Product Slug
                                            </FormLabel>
                                            <FormControl>
                                                <Input readOnly {...field} className="h-10 sm:h-11 bg-muted/30 border-dashed font-mono text-xs cursor-not-allowed" />
                                            </FormControl>
                                            {/* <FormDescription className="text-[11px]">Auto-generated for SEO.</FormDescription> */}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 2: Category & Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Layers className="w-4 h-4 text-muted-foreground" /> Category
                                            </FormLabel>
                                            <FormControl>
                                                <Select options={categoryOption} selected={field.value} setSelected={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="discountPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Percent className="w-4 h-4" /> Discount %
                                            </FormLabel>
                                            <FormControl>
                                                <Input readOnly {...field} className="h-10 sm:h-11 bg-muted/30 font-bold text-green-600" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 3: Color & Size (Grouped 2 cols on mobile) */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Palette className="w-4 h-4 text-muted-foreground" /> Color
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Red, Blue..." {...field} className="h-10 sm:h-11 text-sm" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Ruler className="w-4 h-4 text-muted-foreground" /> Size
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="S, M, L..." {...field} className="h-10 sm:h-11 text-sm" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 4: MRP & Price (Grouped 2 cols on mobile) */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                                <FormField
                                    control={form.control}
                                    name="mrp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <IndianRupee className="w-4 h-4 text-muted-foreground" /> MRP
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="h-10 sm:h-11 text-sm" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sellingPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <IndianRupee className="w-4 h-4 text-muted-foreground" /> Selling price
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="h-10 sm:h-11 bg-primary/5 border-primary/20 font-semibold text-sm" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 5: Description Editor */}
                            <div className="space-y-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="w-4 h-4 text-muted-foreground" /> Product Description
                                </FormLabel>
                                <div className="border rounded-md overflow-hidden bg-background editor-dark-wrapper min-h-[200px]">
                                    <Editor onChange={(e, ed) => form.setValue("description", ed.getData())} />
                                </div>
                            </div>

                            {/* Row 6: Media Selection Area */}
                            <div className="border-2 border-dashed rounded-lg p-5 sm:p-10 bg-muted/5 text-center transition-all hover:bg-muted/10">
                                <MediaModal open={open} setOpen={setOpen} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} isMultiple={true} />
                                {selectedMedia.length > 0 && (
                                    <div className="flex gap-2 justify-center flex-wrap mb-6">
                                        {selectedMedia.map(media => (
                                            <div key={media._id} className="h-16 w-16 sm:h-24 sm:w-24 relative border-2 border-white shadow-sm rounded-md overflow-hidden">
                                                <Image src={media.url} fill alt="preview" className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="mx-auto flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-sm shadow-sm text-sm font-medium active:scale-95 transition-all"
                                >
                                    <ImageIcon className="w-4 h-4" /> Select Media
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 border-t flex justify-end">
                                <ButtonLoading
                                    type="submit"
                                    text="Create Product"
                                    loading={form.formState.isSubmitting}
                                    className="w-full sm:w-auto sm:min-w-[180px] h-10 sm:h-11 font-bold text-gray-800 shadow-sm"
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProduct;