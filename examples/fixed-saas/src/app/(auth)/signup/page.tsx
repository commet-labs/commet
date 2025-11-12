"use client";

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
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Better Auth handles EVERYTHING automatically
      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/checkout",
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
        setIsPending(false);
        return;
      }

      // Success! Better Auth already:
      // ✅ Created user in database
      // ✅ Hashed password
      // ✅ Set session cookies
      // Now redirect to checkout
      router.push("/checkout");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create your account</CardTitle>
        <CardDescription>
          Start your journey with our SaaS platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
