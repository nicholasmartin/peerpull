import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Link from "next/link";
import React from "react";
import { getFlashMessage } from "@/utils/utils";

export default async function Signin() {
  const flash = await getFlashMessage();

  return (
    <div className="flex flex-col w-full">
      <div className="mb-5 sm:mb-8 text-center">
        <h1 className="mb-2 font-semibold text-dark-text text-title-xl sm:text-title-2xl">
          Sign In
        </h1>
        <p className="text-sm text-dark-text-muted">
          Sign in to access your PeerPull dashboard and connect with technical peers
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
                className="border-dark-border bg-dark-surface text-dark-text placeholder:text-dark-text-muted/50 focus:border-blue-primary focus:ring-blue-primary/20"
              />
            </div>
            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-dark-text-muted">
                  Password<span className="text-error-500">*</span>
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-primary hover:text-teal-accent transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Your password"
                  className="border-dark-border bg-dark-surface text-dark-text placeholder:text-dark-text-muted/50 focus:border-blue-primary focus:ring-blue-primary/20"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded-md border border-dark-border bg-dark-surface text-blue-primary transition-all duration-100 ease-linear checked:border-blue-primary checked:bg-blue-primary hover:border-blue-primary/70 focus:shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                <span className="block font-normal text-dark-text-muted text-sm">
                  Keep me logged in
                </span>
              </div>
            </div>

            {/* Button */}
            <div>
              <SubmitButton pendingText="Signing in..." formAction={signInAction} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-dark-bg transition rounded-lg bg-blue-primary shadow-sm hover:bg-blue-secondary shadow-blue-primary/20">
                Sign In
              </SubmitButton>
              <FormMessage flash={flash} />
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-dark-text-muted sm:text-start">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-primary hover:text-teal-accent transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
