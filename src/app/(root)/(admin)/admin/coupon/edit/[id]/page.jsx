"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import { ButtonLoading } from "@/components/Application/ButtonLoading";

import { zSchema } from "@/lib/zodSchema";
import { cn } from "@/lib/utils";
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";
import useFetch from "@/hooks/useFetch";

const EditCoupon = ({ params }) => {
    const { id } = use(params);
    const router = useRouter();

    const { data: getCouponData, } = useFetch(`/api/coupon/get/${id}`);

    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_COUPON_SHOW, label: "Coupon" },
        { href: "", label: "Update Coupon" },
    ];

    const formSchema = zSchema.pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            discountPercentage: 0,
            minShoppingAmount: 0,
            validity: undefined,
        },
    });

    useEffect(() => {
        if (getCouponData?.success && getCouponData?.data) {
            const coupon = getCouponData.data;
            form.reset({
                code: coupon.code,
                discountPercentage: coupon.discountPercentage,
                minShoppingAmount: coupon.minShoppingAmount,
                validity: coupon.validity ? new Date(coupon.validity) : undefined,
            });
        }
    }, [getCouponData, form]);

    async function onSubmit(values) {
        try {
            const { data } = await axios.put(`/api/coupon/update/${id}`, values);

            if (!data.success) {
                toast.error(data.message || "Update failed");
                return;
            }

            toast.success("Coupon updated successfully");
            router.push(ADMIN_COUPON_SHOW);
            router.refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        }
    }

    return (
        <div className="space-y-6">
            <AdminBreadcrumb breadcrumbData={breadcrumbData} />

            <Card className="rounded-md shadow-sm border-muted">
                <CardHeader className="border-b py-3 px-4">
                    <h4 className="font-bold text-xl tracking-tight">Update Coupon</h4>
                </CardHeader>

                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="E.g. SUMMER50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (%) <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minShoppingAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Spend <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="validity"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Validity <span className="text-destructive">*</span></FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push(ADMIN_COUPON_SHOW)}
                                >
                                    Cancel
                                </Button>
                                <ButtonLoading
                                    type="submit"
                                    text="Save Changes"
                                    loading={form.formState.isSubmitting}
                                    className="px-8"
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCoupon;