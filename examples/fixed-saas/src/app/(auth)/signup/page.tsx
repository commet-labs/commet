"use client";

import { signUpAction } from "@/actions/signup-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useActionState } from "react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, {
    success: false,
    message: "",
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create your account</CardTitle>
        <CardDescription>
          Start your journey with our SaaS platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
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
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>

          {state?.message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                state.success
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {state.message}
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
