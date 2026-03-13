import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AuthGateProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function AuthGate({ onLogin, isLoading, error }: AuthGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    await onLogin(email, password);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-primary mb-1">PeerPull</h1>
        <p className="text-dark-text-muted text-xs">Sign in to start reviewing</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && (
          <div className="rounded-md bg-danger/10 border border-danger/20 px-3 py-2 text-xs text-danger">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-dark-text-muted mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className={cn(
              "w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text",
              "placeholder:text-dark-text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary",
              "disabled:opacity-50"
            )}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-dark-text-muted mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            disabled={isLoading}
            className={cn(
              "w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text",
              "placeholder:text-dark-text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary",
              "disabled:opacity-50"
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className={cn(
            "w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-dark-bg",
            "hover:bg-primary-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-xs text-dark-text-muted text-center">
        Don't have an account?{" "}
        <a
          href={`${API_BASE_URL}/signup`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-muted underline"
        >
          Sign up at PeerPull
        </a>
      </p>
    </div>
  );
}
