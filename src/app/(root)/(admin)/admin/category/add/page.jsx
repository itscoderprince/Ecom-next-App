"use client";

import React, { useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  PlusCircle,
  Tag,
  Link2,
  LayoutGrid,
  Info,
  Sparkles
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import { baseSchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";

const AddCategory = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Add Category" },
  ];

  const formSchema = baseSchema.pick({
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "" },
  });

  const watchedName = form.watch("name");

  useEffect(() => {
    if (watchedName) {
      form.setValue("slug", slugify(watchedName, { lower: true, strict: true }));
    } else {
      form.setValue("slug", "");
    }
  }, [watchedName, form]);

  async function onSubmit(values) {
    try {
      const { data } = await axios.post(`/api/category/create`, values);
      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }
      form.reset();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumb - Adjusted padding for mobile */}
      <div className="px-2 sm:px-0">
        <AdminBreadcrumb breadcrumbData={breadcrumbData} />
      </div>

      <Card className="rounded-none rounded-md shadow-sm border-x-0 gap-4 sm:border-x py-0">
        {/* Old Style Header: border-b and tight padding */}
        <CardHeader className="pt-3 pb-2 px-3 sm:px-6 border-b [.border-b]:pb-3 flex flex-row items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-lg sm:text-xl">Add Category</h4>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 py-4 sm:py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="w-4 h-4 text-muted-foreground" /> Category Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name..."
                        {...field}
                        className="h-10 sm:h-11 focus-visible:ring-primary"
                      />
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
                    <FormLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Link2 className="w-4 h-4" /> Category Slug
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          {...field}
                          readOnly
                          className="bg-muted/30 font-mono text-xs sm:text-sm cursor-not-allowed border-dashed pr-10"
                        />
                        <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
                      </div>
                    </FormControl>
                    <FormDescription className="text-[11px] sm:text-xs">
                      Automatically generated for SEO friendly URLs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button - Full width on mobile */}
              <div className="pt-2">
                <ButtonLoading
                  type="submit"
                  text="Create Category"
                  loading={form.formState.isSubmitting}
                  className="w-full sm:w-auto sm:min-w-[150px] cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;