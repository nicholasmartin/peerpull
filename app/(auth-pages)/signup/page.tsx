import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import { getFlashMessage } from "@/utils/utils";

export default async function Signup(props: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const referralCode = searchParams.ref || cookieStore.get("referral_code")?.value || "";
  const flash = await getFlashMessage();

  const inputClasses = "border-dark-border bg-dark-surface text-dark-text placeholder:text-dark-text-muted/50 focus:border-blue-primary focus:ring-blue-primary/20";

  return (
    <div className="flex flex-col w-full">
      <div className="mb-5 sm:mb-8 text-center">
        <h1 className="mb-2 font-semibold text-dark-text text-title-xl sm:text-title-2xl">
          Join the Beta
        </h1>
        <p className="text-sm text-dark-text-muted">
          Join PeerPull and get the technical validation your startup needs to succeed
        </p>
      </div>
      <div>
        <OAuthButtons />

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-dark-text-muted bg-dark-card">
              Or continue with email
            </span>
          </div>
        </div>

        <form>
          <div className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-dark-text-muted">
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="First name"
                  className={inputClasses}
                />
              </div>
              <div>
                <Label className="text-dark-text-muted">
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Last name"
                  className={inputClasses}
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <Label className="text-dark-text-muted">
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={inputClasses}
              />
            </div>
            {/* Password */}
            <div>
              <Label className="text-dark-text-muted">
                Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Your password"
                  className={inputClasses}
                />
              </div>
            </div>
            {/* Referral Code */}
            <div>
              <Label className="text-dark-text-muted">
                Referral Code <span className="text-dark-text-muted/60 text-xs font-normal">(optional)</span>
              </Label>
              <Input
                type="text"
                id="referral_code"
                name="referral_code"
                placeholder="Enter referral code"
                defaultValue={referralCode}
                className={inputClasses}
              />
            </div>
            {/* Terms */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 cursor-pointer rounded-md border border-dark-border bg-dark-surface text-blue-primary transition-all duration-100 ease-linear checked:border-blue-primary checked:bg-blue-primary hover:border-blue-primary/70 focus:shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
              />
              <p className="inline-block font-normal text-dark-text-muted text-sm">
                By creating an account means you agree to the{" "}
                <span className="text-dark-text">
                  Terms and Conditions,
                </span>{" "}
                and our{" "}
                <span className="text-dark-text">
                  Privacy Policy
                </span>
              </p>
            </div>
            {/* Button */}
            <div>
              <SubmitButton pendingText="Signing up..." formAction={signUpAction} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-dark-bg transition rounded-lg bg-blue-primary shadow-sm hover:bg-blue-secondary shadow-blue-primary/20">
                Create Account
              </SubmitButton>
              <FormMessage flash={flash} />
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-dark-text-muted sm:text-start">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-primary hover:text-teal-accent transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
