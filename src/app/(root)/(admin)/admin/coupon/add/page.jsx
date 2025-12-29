"use client";

import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Ticket,
    Percent,
    IndianRupee,
    CalendarIcon,
    PlusCircle
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import AdminBreadcrumb from "@/components/Application/Admin/AdminBreadcrumb";

import { baseSchema } from "@/lib/zodSchema";
import { cn } from "@/lib/utils";
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";

const AddCoupon = () => {
    const breadcrumbData = [
        { href: ADMIN_DASHBOARD, label: "Home" },
        { href: ADMIN_COUPON_SHOW, label: "Coupon" },
        { href: "", label: "Add Coupon" },
    ];

    const formSchema = baseSchema.pick({
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
        <div className="w-full space-y-4 sm:space-y-6 pb-10">
            {/* Breadcrumb Padding */}
            <div className="px-4 sm:px-0">
                <AdminBreadcrumb breadcrumbData={breadcrumbData} />
            </div>

            {/* Card UI: Full width on mobile, rounded on desktop */}
            <Card className="rounded-none sm:rounded-md shadow-none gap-4 sm:shadow-sm border-x-0 sm:border-x py-0">
                <CardHeader className="pt-3 pb-2 px-4 sm:px-6 border-b [.border-b]:pb-4.5 flex flex-row items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-lg sm:text-xl">Add New Coupon</h4>
                </CardHeader>

                <CardContent className="px-2 sm:px-6 py-5 sm:py-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Coupon Code */}
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Ticket className="w-4 h-4 text-muted-foreground" /> Coupon Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. FESTIVE50"
                                                    {...field}
                                                    className="h-10 sm:h-11 uppercase font-semibold focus-visible:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Validity Date Picker */}
                                <FormField
                                    control={form.control}
                                    name="validity"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium mb-1">
                                                <CalendarIcon className="w-4 h-4 text-muted-foreground" /> Expiry Date
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "h-10 sm:h-11 w-full pl-3 text-left font-normal border-input hover:bg-accent",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick an expiry date</span>
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

                                {/* Discount Percentage */}
                                <FormField
                                    control={form.control}
                                    name="discountPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Percent className="w-4 h-4 text-muted-foreground" /> Discount (%)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="10"
                                                    {...field}
                                                    className="h-10 sm:h-11 focus-visible:ring-primary"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Min Shopping Amount */}
                                <FormField
                                    control={form.control}
                                    name="minShoppingAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <IndianRupee className="w-4 h-4 text-muted-foreground" /> Min Shopping Amount
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="500"
                                                    {...field}
                                                    className="h-10 sm:h-11 focus-visible:ring-primary"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Action Button */}
                            <div className="pt-4 border-t flex justify-end">
                                <ButtonLoading
                                    type="submit"
                                    text="Create Coupon"
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

export default AddCoupon;