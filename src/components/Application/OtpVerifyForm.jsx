"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod"; // ✅ use z directly
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { baseSchema, zSchema } from "@/lib/zodSchema";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const OtpVerifyForm = ({ email, onSubmit }) => {
  const formSchema = baseSchema.pick({ otp: true, email: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "", email },
  });

  return (
    <div className="w-[400px] mx-auto mt-5">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-foreground">
          Enter Verification Code
        </CardTitle>
        <CardDescription className="text-sm mb-2 text-muted-foreground">
          We sent a 6-digit code to your registered email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6"
        >
          <FieldGroup className="w-full">
            <Field>
              <InputOTP
                id="otp"
                maxLength={6}
                value={form.watch("otp")}
                onChange={(val) => form.setValue("otp", val)}
              >
                <InputOTPGroup className="gap-2 flex mx-auto justify-center mt-3">
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
              <Button
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
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  onClick={async () => {
                    const res = await axios.post("/api/auth/resend-otp", { email });
                    if (res.data.success) toast.success("OTP resent");
                    else toast.error(res.data.message);
                  }}
                  className="text-primary hover:underline"
                >
                  Resend
                </button>

              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </div>
  );
};

export default OtpVerifyForm;
