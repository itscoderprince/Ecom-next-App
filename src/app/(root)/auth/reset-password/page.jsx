"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { toast } from "sonner";
import axios from "axios";
import OtpVerifyForm from "@/components/Application/OtpVerifyForm";
import UpdatePassword from "@/components/Application/UpdatePassword";
import { WEBSITE_LOGIN } from "@/routes/Website.route";

const ResetPassword = () => {
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // ❗ FIXED: manual loading state
  const [sendingOtpLoading, setSendingOtpLoading] = useState(false);

  const formSchema = baseSchema.pick({ email: true });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // STEP 1 → Send OTP
  async function onSubmit(values) {
    setSendingOtpLoading(true); // start loader

    try {
      const { data } = await axios.post("/api/auth/reset-password/send-otp", values);
      setOtpEmail(values.email);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setSendingOtpLoading(false); // stop loader
    }
  }

  // STEP 2 → Verify OTP
  async function handleOtpVerification(values) {
    try {
      const { data } = await axios.post("/api/auth/reset-password/verify-otp", values);
      toast.success(data.message);
      setIsOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  }

  return (
    <Card className="w-[450px]">
      <CardContent>
        {!otpEmail ? (
          <>
            <div className="text-center mb-5">
              <h1 className="text-2xl font-semibold">Reset Password</h1>
              <p>Enter your email to reset the password</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ButtonLoading
                  type="submit"
                  text="Send OTP"
                  variant="default"
                  loading={sendingOtpLoading} // ← FIXED
                  className="w-full mt-1 cursor-pointer"
                />
              </form>
            </Form>

            <div className="flex flex-col items-center justify-center mt-1">
              <Link
                href={WEBSITE_LOGIN}
                className="text-primary underline hover:text-primary/80"
              >
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            {!isOtpVerified ? (
              <OtpVerifyForm email={otpEmail} onSubmit={handleOtpVerification} />
            ) : (
              <UpdatePassword email={otpEmail} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
