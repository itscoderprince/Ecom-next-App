"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import verifiedImg from "../../../../../../public/assets/images/verified.gif";
import verificationFailedImg from "../../../../../../public/assets/images/verification-failed.gif";
import { WEBSITE_HOME } from "@/routes/Website.route";

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
        console.error("Verification failed:", error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h1 className="text-xl font-semibold animate-pulse">
          Verifying your email, please wait...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          {isVerified ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <Image
                src={verifiedImg}
                alt="Verified"
                width={180}
                height={180}
                className="rounded-full"
                priority
              />

              <h1 className="text-2xl font-bold text-green-700">
                Email verification successful ✅
              </h1>

              <p className="text-gray-600">
                Your account has been verified successfully. You can now enjoy
                shopping.
              </p>

              <Button asChild className="mt-4">
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-6">
              <Image
                src={verificationFailedImg}
                alt="Verification Failed"
                width={180}
                height={180}
                className="rounded-full"
                priority
              />

              <h1 className="text-2xl font-bold text-red-700">
                Email verification failed ❌
              </h1>

              <p className="text-gray-600">
                The verification link may be invalid or expired.
              </p>

              <Button asChild variant="destructive" className="mt-4">
                <Link href={WEBSITE_HOME}>Go Back Home</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
