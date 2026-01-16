"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Mail, Lock, Eye, LogIn, EyeClosed } from "lucide-react";
import { loginSchema } from "@/lib/zodSchema";
import Link from "next/link";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_RESETPASSWORD,
  WEBSITE_SIGNUP,
} from "@/routes/Website.route";
import { UIButton } from "@/components/Application/UIButton";
import { toast } from "sonner";
import axios from "axios";
import OTPForm from "@/components/Application/OtpForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login Submit
  async function onSubmit(values) {
    try {
      const { data } = await axios.post("/api/auth/login", values);

      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }

      setOtpEmail(values.email);
      form.reset();
      toast.success(data.message || "Login initiated.");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function otpVerify(values) {
    try {
      const { data } = await axios.post("/api/auth/verify-otp", values);
      if (!data.success) {
        toast.error(data.message || "Invalid OTP");
        setOtpEmail("");
        return;
      }

      form.reset();
      toast.success("OTP verified successfully!");
      dispatch(login(data.data));

      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        data?.data.role === "admin"
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed!");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>
            {otpEmail ? " OTP Verification Code" : "Login to your account"}
          </CardTitle>

          <CardDescription>
            {otpEmail
              ? "Please enter the OTP sent to your email."
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!otpEmail ? (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Field>
                            <FieldLabel>
                              <Mail className="h-4 w-4" /> Email
                            </FieldLabel>
                            <Input
                              type="email"
                              placeholder="m@example.com"
                              {...field}
                            />
                            <FormMessage />
                          </Field>
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <Field>
                            <div className="flex items-center">
                              <FieldLabel htmlFor="password">
                                <Lock className="h-4 w-4" /> Password
                              </FieldLabel>
                              <Link
                                href={WEBSITE_RESETPASSWORD}
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                              >
                                Forgot your password?
                              </Link>
                            </div>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Password"
                              />

                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeClosed className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>

                            <FormMessage />
                          </Field>
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <Field>
                      <UIButton
                        type="submit"
                        text="Login"
                        icon={LogIn}
                        variant="default"
                        loading={form.formState.isSubmitting}
                      />

                      <FieldSeparator className="my-2">
                        Or continue with
                      </FieldSeparator>

                      <Button variant="outline" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Login with Google
                      </Button>

                      <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                          href={WEBSITE_SIGNUP}
                          className="font-md underline underline-offset-4 hover:text-primary"
                        >
                          Sign up
                        </Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </form>
              </Form>
            </>
          ) : (
            <>
              <OTPForm email={otpEmail} onSubmit={otpVerify} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
