"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { baseSchema, zSchema } from "@/lib/zodSchema";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/Website.route";

const UpdatePassword = ({ email }) => {
    console.log(email);

    const router = useRouter();
    const [showPsw, setShowPsw] = useState(false);
    const [showConfirmPsw, setShowConfirmPsw] = useState(false);

    const formSchema = baseSchema.pick({
        email: true,
        password: true,
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
        },
    });

    async function onSubmit(values) {
        try {
            console.log(values);
            const { data } = await axios.put("/api/auth/reset-password/update-password", values);

            if (!data.success) {
                toast.error(data.message || "Something went wrong!");
                return;
            }

            toast.success(data.message || "Password updated successfully!");
            form.reset();
            router.push(WEBSITE_LOGIN);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "User already exists. Please try logging in.");
        }
    }

    return (
        <div > {/* ✅ FIXED WRAPPER */}
            <CardContent>
                <div className="text-center mb-5">
                    <h1 className="text-2xl font-semibold">Update your password</h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showPsw ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...field}
                                                className="pr-10"
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() => setShowPsw(!showPsw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPsw ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showConfirmPsw ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                {...field}
                                                className="pr-10"
                                            />
                                        </FormControl>

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPsw(!showConfirmPsw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPsw ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonLoading
                            type="submit"
                            text="Update Password"
                            variant="default"
                            loading={form.formState.isSubmitting}
                            className="w-full mt-2 cursor-pointer"
                        />
                    </form>
                </Form>
            </CardContent>
        </div>
    );
};

export default UpdatePassword;
