"use client";

import { otpSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UIButton } from "./UIButton";
import { toast } from "sonner";
import axios from "axios";
import { useState, useEffect } from "react";

const OTPForm = ({ email, onSubmit }) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", email },
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function resendOtp() {
    try {
      setIsResendingOtp(true);
      const { data } = await axios.post("/api/auth/resend-otp", { email });
      if (!data.success) {
        toast.error(data.message || "Failed to resend OTP");
        return;
      }

      toast.success(data.message || "OTP resent successfully!");
      setCountdown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResendingOtp(false);
    }
  }


  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-6"
    >
      <FieldGroup className="w-full gap-3">
        <Field>
          <FieldLabel htmlFor="otp" className="sm:ml-2">
            Verification code
          </FieldLabel>
          <InputOTP
            id="otp"
            maxLength={6}
            value={form.watch("otp")}
            onChange={(val) => form.setValue("otp", val)}
          >
            <InputOTPGroup className="flex gap-2.5 sm:gap-4 items-center mx-auto">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-10 text-lg border rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {/* ✅ Show error message */}
          {form.formState.errors.otp && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {form.formState.errors.otp.message}
            </p>
          )}

          <FieldDescription className="text-center text-muted-foreground mt-2">
            Enter the 6-digit code we emailed you.
          </FieldDescription>
        </Field>

        <div className="flex flex-col gap-4 mt-6">
          <UIButton
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </UIButton>

          <p className="text-sm text-center text-muted-foreground">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={resendOtp}
              disabled={isResendingOtp || countdown > 0}
              className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResendingOtp
                ? "Sending..."
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend"}
            </button>
          </p>
        </div>
      </FieldGroup>
    </form>
  );
};

export default OTPForm;
