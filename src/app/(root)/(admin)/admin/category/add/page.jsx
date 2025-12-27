"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanel.route";
import axios from "axios";
import React, { useEffect } from "react";
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

const AddCategory = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Add Category" },
  ];

  // zod schema
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  });

  // React Hook Form Initialization
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "" },
  });

  // Submit handler to update media information
  async function onSubmit(values) {
    try {
      const { data } = await axios.post(`/api/category/create`, values);
      if (!data.success) {
        toast.error(data.message || "Update failed");
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
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="font-semibold text-xl">Add Category</h4>
        </CardHeader>

        <CardContent className="mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug..." readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <ButtonLoading
                type="submit"
                text="Add"
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

export default AddCategory;
