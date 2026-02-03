"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth/auth-client";
import { handlePostSignupCheckout } from "@/lib/payments/actions";

type Mode = "signin" | "signup";

export function FormAuth({ mode = "signin" }: { mode?: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const planCode = searchParams.get("planCode") || undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const heading = mode === "signin" ? "Welcome back" : "Create an account";
  const copy =
    mode === "signin"
      ? "Enter your credentials to access your account"
      : "Enter your information to get started";
  const primaryCta = mode === "signin" ? "Sign in" : "Create account";
  const footerCopy =
    mode === "signin"
      ? "Don't have an account?"
      : "Already have an account?";
  const footerLinkLabel = mode === "signin" ? "Create an account" : "Sign in";

  const secondaryHref = useMemo(() => {
    const nextPath = mode === "signin" ? "/sign-up" : "/sign-in";
    const params = new URLSearchParams();
    if (redirect && redirect !== "/dashboard") {
      params.set("redirect", redirect);
    }
    if (planCode) {
      params.set("planCode", planCode);
    }
    const search = params.size ? `?${params.toString()}` : "";
    return `${nextPath}${search}`;
  }, [mode, redirect, planCode]);

  const planBanner = planCode ? (
    <div className="flex flex-col rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
      <span className="font-medium">Selected plan</span>
      <span>Complete your signup to continue with {planCode}.</span>
    </div>
  ) : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const result = await signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message || "Failed to sign in");
          setLoading(false);
          return;
        }
      } else {
        const result = await signUp.email({
          name,
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message || "Failed to create account");
          setLoading(false);
          return;
        }
      }

      if (planCode) {
        const result = await handlePostSignupCheckout(planCode);
        if (result.success && result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
          return;
        }

        setError(
          result.error || "We couldn't continue with checkout. Please try again.",
        );
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">{copy}</p>
        </div>

        {planBanner}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              {mode === "signup" ? (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            className="h-11 w-full font-medium"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              primaryCta
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {footerCopy}{" "}
          <Link
            href={secondaryHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
