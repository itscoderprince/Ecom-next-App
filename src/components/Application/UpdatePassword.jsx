"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/Website.route";
import { UIButton } from "./UIButton";
import { updatePasswordSchema } from "@/lib/zodSchema";

const UpdatePassword = ({ email }) => {
    const router = useRouter();
    const [showPsw, setShowPsw] = useState(false);
    const [showConfirmPsw, setShowConfirmPsw] = useState(false);

    const form = useForm({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values) {
        try {
            const { data } = await axios.put(
                "/api/auth/reset-password/update-password",
                values,
            );

            if (!data.success) {
                toast.error(data.message || "Something went wrong!");
                return;
            }

            toast.success(data.message || "Password updated successfully!");
            form.reset();
            router.push(WEBSITE_LOGIN);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "User already exists. Please try logging in.",
            );
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Password
                            </FormLabel>

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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPsw ? (
                                        <EyeClosed className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
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
                            <FormLabel className="flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Confirm Password
                            </FormLabel>

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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showConfirmPsw ? (
                                        <EyeClosed className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <UIButton
                    type="submit"
                    text="Update Password"
                    variant="default"
                    loading={form.formState.isSubmitting}
                    className="w-full cursor-pointer"
                />
            </form>
        </Form>
    );
};

export default UpdatePassword;

