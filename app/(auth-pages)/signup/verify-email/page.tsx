import { Mail } from "lucide-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-primary/10">
        <Mail className="h-7 w-7 text-blue-primary" />
      </div>

      <h1 className="font-montserrat text-2xl font-bold text-dark-text">
        Check your email
      </h1>

      <p className="text-dark-text-muted">
        We sent a verification link to{" "}
        {email ? (
          <span className="font-semibold text-dark-text">{email}</span>
        ) : (
          "your email address"
        )}
        . Click the link to activate your account.
      </p>

      <p className="text-sm text-dark-text-muted">
        Don&apos;t see it? Check your spam folder.
      </p>
    </div>
  );
}
