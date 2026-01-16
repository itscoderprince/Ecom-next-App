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

import { Mail, Lock, Eye, LogIn, User, EyeClosed } from "lucide-react";
import { registerSchema } from "@/lib/zodSchema";
import Link from "next/link";
import { UIButton } from "@/components/Application/UIButton";
import { WEBSITE_LOGIN } from "@/routes/Website.route";
import axios from "axios";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      const { data } = await axios.post("/api/auth/signup", values);
      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }

      form.reset();
      toast.success(data.message || "Login initiated.");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-5">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>
                          <User className="h-4 w-4" /> Name
                        </FieldLabel>
                        <Input placeholder="Your name" {...field} />
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
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
                      <Field className="gap-2">
                        <FieldLabel>
                          <Lock className="h-4 w-4" /> Password
                        </FieldLabel>

                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>
                          <Lock className="h-4 w-4" /> Confirm Password
                        </FieldLabel>

                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
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
                    text="Signup"
                    icon={LogIn}
                    variant="default"
                    loading={form.formState.isSubmitting}
                  />

                  <FieldSeparator className="my-2">
                    Or continue with
                  </FieldSeparator>

                  <Button variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>

                  <FieldDescription className="text-center font-semibold">
                    Already have an account?{" "}
                    <Link
                      href={WEBSITE_LOGIN}
                      className="font-md underline underline-offset-4 hover:text-primary"
                    >
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card >
    </div >
  );
}
