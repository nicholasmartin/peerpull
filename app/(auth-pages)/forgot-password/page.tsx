import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col w-full">
      <div className="mb-5 sm:mb-8 text-center">
        <h1 className="mb-2 font-semibold text-dark-text text-title-xl sm:text-title-2xl">
          Reset Password
        </h1>
        <p className="text-sm text-dark-text-muted">
          Enter your email address to receive a password reset link
        </p>
      </div>
      <form className="mt-2">
        <div className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-dark-text-muted">Email<span className="text-error-500">*</span></Label>
            <Input
              name="email"
              placeholder="you@example.com"
              type="email"
              className="border-dark-border bg-dark-surface text-dark-text placeholder:text-dark-text-muted/50 focus:border-blue-primary focus:ring-blue-primary/20"
            />
          </div>
          <div>
            <SubmitButton
              formAction={forgotPasswordAction}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-dark-bg transition rounded-lg bg-blue-primary shadow-sm hover:bg-blue-secondary shadow-blue-primary/20"
            >
              Send Reset Link
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </div>
      </form>
      <div className="mt-5 text-center">
        <p className="text-sm font-normal text-dark-text-muted">
          Remember your password?{" "}
          <Link className="text-blue-primary hover:text-teal-accent transition-colors" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
