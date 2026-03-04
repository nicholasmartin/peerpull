"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

type Provider = "google" | "github" | "linkedin_oidc" | "twitch";

const providers: { id: Provider; label: string; icon: React.ReactNode }[] = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
        <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
        <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
        <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    id: "linkedin_oidc",
    label: "LinkedIn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.0392 17.0431H14.0781V12.4028C14.0781 11.2964 14.0576 9.8717 12.5363 9.8717C10.9938 9.8717 10.7572 11.0759 10.7572 12.3209V17.0428H7.79619V7.49756H10.6383V8.80106H10.6793C11.0743 8.05006 12.0434 7.25906 13.4837 7.25906C16.4849 7.25906 17.04 9.23456 17.04 11.8053V17.0431H17.0392ZM4.44968 6.19256C3.49768 6.19256 2.72668 5.41756 2.72668 4.46856C2.72668 3.52006 3.49818 2.74556 4.44968 2.74556C5.39868 2.74556 6.17318 3.52006 6.17318 4.46856C6.17318 5.41756 5.39818 6.19256 4.44968 6.19256ZM5.93268 17.0431H2.96668V7.49756H5.93268V17.0431ZM18.5195 0.000556641H1.47668C0.660183 0.000556641 0.000183105 0.645557 0.000183105 1.44156V18.5586C0.000183105 19.3551 0.660183 20.0006 1.47668 20.0006H18.5175C19.3333 20.0006 20.0002 19.3551 20.0002 18.5586V1.44156C20.0002 0.645557 19.3333 0.000556641 18.5175 0.000556641H18.5195Z" fill="#0A66C2" />
      </svg>
    ),
  },
  {
    id: "twitch",
    label: "Twitch",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.16667 0L0.833336 3.33333V16.6667H5V20L8.33334 16.6667H11.25L18.3333 9.58333V0H4.16667ZM16.6667 8.75L13.75 11.6667H10.8333L8.33334 14.1667V11.6667H5V1.66667H16.6667V8.75Z" fill="#9146FF" />
        <path d="M14.5833 4.58333H13.3333V8.33333H14.5833V4.58333Z" fill="#9146FF" />
        <path d="M10.4167 4.58333H9.16666V8.33333H10.4167V4.58333Z" fill="#9146FF" />
      </svg>
    ),
  },
];

export default function OAuthButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);

  const handleOAuth = async (provider: Provider) => {
    setLoading(provider);
    const supabase = createClient();

    // Preserve referral code through the OAuth redirect chain
    const currentUrl = new URL(window.location.href);
    const ref = currentUrl.searchParams.get("ref");
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    if (ref) {
      callbackUrl.searchParams.set("ref", ref);
    }

    const options: { redirectTo: string; queryParams?: Record<string, string> } = {
      redirectTo: callbackUrl.toString(),
    };

    // Google needs extra params for refresh token
    if (provider === "google") {
      options.queryParams = {
        access_type: "offline",
        prompt: "consent",
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      toast.error(error.message);
      setLoading(null);
    }
    // On success, the browser redirects — no need to handle response
  };

  const buttonClasses =
    "inline-flex items-center justify-center gap-3 w-full py-3 text-sm font-medium rounded-lg border border-dark-border bg-dark-surface text-dark-text hover:border-blue-primary/50 hover:bg-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={loading !== null}
          onClick={() => handleOAuth(p.id)}
          className={buttonClasses}
        >
          {loading === p.id ? (
            <svg className="animate-spin h-5 w-5 text-dark-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            p.icon
          )}
          {p.label}
        </button>
      ))}
    </div>
  );
}
