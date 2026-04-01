"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/auth-client";
import { handlePostSignupCheckout } from "@/lib/payments/actions";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const planCode = searchParams.get("planCode") || undefined;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signUp.email({ name, email, password });

    if (result.error) {
      setError(result.error.message || "Something went wrong");
      setLoading(false);
      return;
    }

    if (planCode) {
      const checkoutResult = await handlePostSignupCheckout(planCode);
      if (checkoutResult.success && checkoutResult.checkoutUrl) {
        window.location.href = checkoutResult.checkoutUrl;
        return;
      }
      setError(
        checkoutResult.error ||
          "We couldn't continue with checkout. Please try again.",
      );
      setLoading(false);
      return;
    }

    router.push(redirect);
  }

  const signInHref = planCode
    ? `/sign-in?planCode=${planCode}${redirect !== "/dashboard" ? `&redirect=${redirect}` : ""}`
    : "/sign-in";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started with your subscription.</CardDescription>
      </CardHeader>
      <CardContent>
        {planCode && (
          <div className="mb-4 flex flex-col rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
            <span className="font-medium">Selected plan</span>
            <span className="text-muted-foreground">
              Complete your signup to continue with {planCode}.
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive-foreground">{error}</p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={signInHref}
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
