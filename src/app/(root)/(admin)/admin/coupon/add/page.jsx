"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ADMIN_COUPON_SHOW,
    ADMIN_DASHBOARD,
} from "@/routes/AdminPanel.route";
import axios from "axios";
import React from "react";
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
// import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";

const AddCoupon = () => {
    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_COUPON_SHOW, label: "Coupon" },
        { href: "", label: "Add Coupon" },
    ];

    // zod schema - Ensure 'validity' in zSchema is z.date() or z.any()
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

    async function onSubmit(values) {
        try {
            // Note: values.validity will be a JS Date object here
            const { data } = await axios.post(`/api/coupon/create`, values);
            if (!data.success) {
                toast.error(data.message || "Adding failed");
                return;
            }

            form.reset();
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        }
    }

    return (
        <div className="space-y-6">
            <AdminBreadcrumb breadcrumbData={breadcrumbData} />

            <Card className="rounded-md shadow-sm border-muted">
                <CardHeader className="border-b [.border-b]:pb-1 px-3">
                    <h4 className="font-bold text-xl tracking-tight">Add Coupon</h4>
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
                                        <FormLabel>Discount Percentage (%) <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
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
                                        <FormLabel>Min Shopping Amount <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="500"
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
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal border-input hover:bg-accent",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a expiry date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    // Disables past dates
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2 flex justify-end">
                                <ButtonLoading
                                    type="submit"
                                    text="Create Coupon"
                                    loading={form.formState.isSubmitting}
                                    className="w-full md:w-auto px-8"
                                    variant="primary"
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddCoupon;