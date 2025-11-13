"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import logo from "../../../../../public/assets/images/logo-black.png";
import { WEBSITE_RIGISTER } from "@/routes/Website.route";
import { toast } from "sonner";
import axios from "axios";
import OtpVerifyForm from "@/components/Application/OtpVerifyForm";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [showPsw, setShowPsw] = useState(false);
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zSchema.pick({
    email: true,
  }).extend({
    password: z
      .string()
      .nonempty("Password is required.")
      .min(3, "Password must be at least 3 characters."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      // Send user registration data to backend
      const { data } = await axios.post("/api/auth/login", values);

      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }

      toast.success(data.message || "Login successful!");
      setOtpEmail(values.email)

      form.reset();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  }

  async function otpVerify(values) {
    try {
      const { data } = await axios.post("/api/auth/verify-otp", values);
      if (!data.success) {
        toast.error(data.message || "Invalid OTP");
        setOtpEmail("")
        dispatch(login(data.data))
      }
      toast.success("OTP verified successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed!");
    }
  }


  return (
    <Card className="w-[450px]">
      <CardContent>
        <div className="flex justify-center">
          <Image src={logo} alt="logo" className="w-[150px] h-auto" priority />
        </div>
        {
          !otpEmail
            ?
            <>
              <div className="text-center mb-5">
                <h1 className="text-2xl font-semibold">Login to your Account</h1>
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
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPsw ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    type="submit"
                    text="Login"
                    variant="default"
                    loading={form.formState.isSubmitting}
                    className="w-full mt-2 cursor-pointer"
                  />
                </form>
              </Form>

              <div className="text-center mt-4 flex items-center justify-center gap-2 text-sm">
                <p>Don’t have an account?</p>
                <Link href={WEBSITE_RIGISTER} className="text-primary underline hover:text-primary/80">
                  Create one
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center mt-1">
                <Link href="/frogot-password" className="text-primary text-center mx-auto underline hover:text-primary/80">
                  Forgot password
                </Link>
              </div>
            </>
            :
            <>
              <OtpVerifyForm email={otpEmail} onSubmit={otpVerify} />
            </>
        }
      </CardContent>
    </Card>
  );
};

export default LoginPage;
