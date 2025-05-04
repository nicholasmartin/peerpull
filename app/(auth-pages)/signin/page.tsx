import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import React from "react";

export default async function Signin(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-xl dark:text-white/90 sm:text-title-2xl">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to access your PeerPull dashboard and connect with technical peers
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <img src="/images/google-logo.svg" alt="Google logo" width="20" height="20" />
                Sign in with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <img src="/images/x-logo.svg" alt="X logo" width="21" height="20" className="fill-current" />
                Sign in with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form>
              <div className="space-y-5">
                {/* <!-- Email --> */}
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
                {/* <!-- Password --> */}
                <div>
                  <div className="flex justify-between items-center">
                    <Label>
                      Password<span className="text-error-500">*</span>
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
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
                    />
                  </div>
                </div>
                
                {/* <!-- Remember me --> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer rounded-md border border-gray-300 text-blue-500 transition-all duration-100 ease-linear checked:border-blue-500 hover:border-blue-500 focus:shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-600 dark:bg-white/5 dark:checked:border-blue-400 dark:checked:bg-blue-400 dark:focus:ring-offset-0"
                    />
                    <span className="block font-normal text-gray-700 text-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                </div>
                
                {/* <!-- Button --> */}
                <div>
                  <SubmitButton pendingText="Signing in..." formAction={signInAction} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-sm hover:bg-blue-600">
                    Sign In
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
