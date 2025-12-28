"use client";

import React, { use } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import { ButtonLoading } from "@/components/Application/ButtonLoading";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanel.route";
import { baseSchema, zSchema } from "@/lib/zodSchema";

import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_MEDIA_SHOW, label: "Media" },
  { href: "", label: "Edit Media" },
];

const EditMedia = ({ params }) => {
  const { id } = use(params);

  // ===== Fetch Media Data =====
  const {
    data: mediaData,
    loading,
    error,
    refetch,
  } = useFetch(`/api/media/get/${id}`);

  // ===== Form Schema =====
  const formSchema = baseSchema.pick({
    _id: true,
    title: true,
    alt: true,
  });

  // ===== Form Setup =====
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      title: "",
      alt: "",
    },
  });

  // Prefill form when data loads
  React.useEffect(() => {
    if (mediaData?.success) {
      form.reset({
        _id: mediaData?.data?._id || "",
        title: mediaData?.data?.title || "",
        alt: mediaData?.data?.alt || "",
      });
    }
  }, [mediaData, form]);

  // ===== Update Media Handler =====
  async function onSubmit(values) {
    try {
      const { data } = await axios.put(`/api/media/update`, values);

      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Media updated successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  // ===== UI =====
  return (
    <div>
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="font-semibold text-xl">Edit Media</h4>
        </CardHeader>

        <CardContent className="mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Current Image */}
              <div className="mb-5">
                <Image
                  src={
                    mediaData?.data?.secure_url ||
                    "/images/img-placeholder.webp"
                  }
                  height={150}
                  width={150}
                  alt={mediaData?.data?.alt || "Image"}
                />
              </div>

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter media title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alt Text */}
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alt text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                type="submit"
                text="Update"
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

export default EditMedia;
