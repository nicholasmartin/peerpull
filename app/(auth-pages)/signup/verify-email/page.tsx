import { Mail } from "lucide-react";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const safeEmail = email && isValidEmail(email) ? email : null;

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
        {safeEmail ? (
          <span className="font-semibold text-dark-text">{safeEmail}</span>
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
