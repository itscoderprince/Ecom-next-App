"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  PlusCircle,
  Box,
  Barcode,
  Palette,
  Ruler,
  IndianRupee,
  Percent,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import MediaModal from "@/components/Application/Admin/MediaModal";
import { baseSchema } from "@/lib/zodSchema";
import { sizes } from "@/lib/utils";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AdminPanel.route";

const AddProductVariant = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
    { href: "", label: "Add Product Variants" },
  ];

  const [productOption, setProductOption] = useState([]);
  const { data: getProduct } = useFetch("/api/product?deleteType=SD&size=1000");

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const form = useForm({
    resolver: zodResolver(
      baseSchema.pick({
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
      })
    ),
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

  const watchedMrp = form.watch("mrp");
  const watchedSellingPrice = form.watch("sellingPrice");

  useEffect(() => {
    const mrpNum = Number(watchedMrp);
    const spNum = Number(watchedSellingPrice);

    if (mrpNum > 0 && spNum > 0) {
      const discount = ((mrpNum - spNum) / mrpNum) * 100;
      form.setValue("discountPercentage", Math.max(0, Math.round(discount)));
    }
  }, [watchedMrp, watchedSellingPrice, form]);

  useEffect(() => {
    if (getProduct?.success) {
      const options = getProduct.data.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setProductOption(options);
    }
  }, [getProduct]);

  async function onSubmit(values) {
    try {
      if (selectedMedia.length <= 0) return toast.error("Please select media.");
      values.media = selectedMedia.map((media) => media._id);

      const { data } = await axios.post(`/api/product-variant/create`, values);
      if (!data.success) {
        toast.error(data.message || "Adding failed");
        return;
      }

      form.reset();
      setSelectedMedia([]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 pb-10">
      {/* Breadcrumb padding adjustment */}
      <div className="px-4 sm:px-0">
        <AdminBreadcrumb breadcrumbData={breadcrumbData} />
      </div>
      <Card className="w-full gap-4 rounded-md shadow-none sm:shadow-sm border-x-0 sm:border-x py-0">
        <CardHeader className="pt-3 pb-2 px-4 sm:px-6 border-b [.border-b]:pb-4.5 flex flex-row items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-lg sm:text-xl">Add Product Variant</h4>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 py-5 sm:py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Box className="w-4 h-4 text-muted-foreground" /> Select Product
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

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Barcode className="w-4 h-4 text-muted-foreground" /> SKU Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PROD-RED-XL"
                          {...field}
                          className="h-10 sm:h-11 focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Grouped Row: 2 columns on Mobile */}
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
                        <Input
                          placeholder="Red"
                          {...field}
                          className="h-10 sm:h-11 focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
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
              </div>

              {/* Grouped Row: 2 columns on Mobile */}
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
                        <Input
                          type="number"
                          {...field}
                          className="h-10 sm:h-11 focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" /> Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-10 sm:h-11 bg-primary/5 border-primary/20 font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Percent className="w-4 h-4" /> Discount
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        {...field}
                        className="h-10 bg-muted/30 font-bold text-green-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="border-2 border-dashed rounded-lg p-5 sm:p-10 bg-muted/5 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  setSelectedMedia={setSelectedMedia}
                  selectedMedia={selectedMedia}
                  isMultiple={true}
                />
                {selectedMedia.length > 0 && (
                  <div className="flex gap-2 justify-center flex-wrap mb-5">
                    {selectedMedia.map((media) => (
                      <div
                        key={media._id}
                        className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-white rounded shadow-sm overflow-hidden"
                      >
                        <Image src={media.url} fill alt="preview" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="mx-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-medium sm:w-auto"
                >
                  <ImageIcon className="w-4 h-4" /> Select Media
                </button>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <ButtonLoading
                  type="submit"
                  text="Create Variant"
                  loading={form.formState.isSubmitting}
                  className="w-full sm:w-auto sm:min-w-[180px] h-11 font-bold"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductVariant;