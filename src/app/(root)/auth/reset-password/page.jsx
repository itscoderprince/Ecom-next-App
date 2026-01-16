"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import UpdatePassword from "@/components/Application/UpdatePassword";
import { WEBSITE_LOGIN } from "@/routes/Website.route";
import { UIButton } from "@/components/Application/UIButton";
import OTPForm from "@/components/Application/OtpForm";
import { resendOtpSchema } from "@/lib/zodSchema";

const ResetPassword = () => {
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [sendingOtpLoading, setSendingOtpLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(resendOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  // Get dynamic title and description based on current step
  const getHeaderContent = () => {
    if (!otpEmail) {
      return {
        title: "Reset Password",
        description: "Enter your email to reset the password",
      };
    }
    if (!isOtpVerified) {
      return {
        title: "OTP Verification",
        description: "Please enter the OTP sent to your email",
      };
    }
    return {
      title: "Update Password",
      description: "Enter your new password below",
    };
  };

  const { title, description } = getHeaderContent();

  // STEP 1 → Send OTP
  async function onSubmit(values) {
    setSendingOtpLoading(true);

    try {
      const { data } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values,
      );
      setOtpEmail(values.email);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setSendingOtpLoading(false);
    }
  }

  // STEP 2 → Verify OTP
  async function handleOtpVerification(values) {
    try {
      const { data } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values,
      );
      toast.success(data.message);
      setIsOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {!otpEmail ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <UIButton
                  type="submit"
                  text="Send OTP"
                  variant="default"
                  loading={sendingOtpLoading}
                  className="w-full cursor-pointer"
                />
              </form>
            </Form>

            <div className="flex flex-col items-center justify-center mt-4">
              <Link
                href={WEBSITE_LOGIN}
                className="text-sm text-primary underline hover:text-primary/80"
              >
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            {!isOtpVerified ? (
              <OTPForm email={otpEmail} onSubmit={handleOtpVerification} />
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

