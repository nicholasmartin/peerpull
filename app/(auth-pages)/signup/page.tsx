import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import React from "react";

export default async function Signup(props: {
  searchParams: Promise<Message & { ref?: string }>;
}) {
  const searchParams = await props.searchParams;
  const referralCode = ("ref" in searchParams ? (searchParams as any).ref : "") || "";

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-xl dark:text-white/90 sm:text-title-2xl">
              Join the Beta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join PeerPull and get the technical validation your startup needs to succeed
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                </div>
                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Your password"
                    />
                  </div>
                </div>
                {/* Referral Code */}
                <div>
                  <Label>
                    Referral Code <span className="text-gray-400 text-xs font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="text"
                    id="referral_code"
                    name="referral_code"
                    placeholder="Enter referral code"
                    defaultValue={referralCode}
                  />
                </div>
                {/* Terms */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer rounded-md border border-gray-300 text-blue-500 transition-all duration-100 ease-linear checked:border-blue-500 hover:border-blue-500 focus:shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-600 dark:bg-white/5 dark:checked:border-blue-400 dark:checked:bg-blue-400 dark:focus:ring-offset-0"
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* Button */}
                <div>
                  <SubmitButton pendingText="Signing up..." formAction={signUpAction} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-sm hover:bg-blue-600">
                    Create Account
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
