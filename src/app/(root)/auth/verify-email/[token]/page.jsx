"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import verifiedImg from "../../../../../../public/assets/images/verified.gif";
import verificationFailedImg from "../../../../../../public/assets/images/verification-failed.gif";
import { WEBSITE_HOME, WEBSITE_LOGIN } from "@/routes/Website.route";
import { Loader2 } from "lucide-react";

const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });
        if (data.success) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Verifying Email
          </CardTitle>
          <CardDescription>
            Please wait while we verify your email...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        {isVerified ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <Image
              src={verifiedImg}
              alt="Verified"
              width={150}
              height={150}
              className="rounded-full"
              priority
            />

            <h1 className="text-2xl font-bold text-primary">
              Email Verified Successfully! ✅
            </h1>

            <p className="text-muted-foreground">
              Your account has been verified. You can now log in and start
              shopping.
            </p>

            <Button asChild className="mt-4">
              <Link href={WEBSITE_LOGIN}>Continue to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-6">
            <Image
              src={verificationFailedImg}
              alt="Verification Failed"
              width={150}
              height={150}
              className="rounded-full"
              priority
            />

            <h1 className="text-2xl font-bold text-destructive">
              Verification Failed ❌
            </h1>

            <p className="text-muted-foreground">
              The verification link may be invalid or expired.
            </p>

            <Button asChild variant="outline" className="mt-4">
              <Link href={WEBSITE_HOME}>Go Back Home</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;

