"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth/auth-client";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { CircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldErrors = {
  email?: string[];
  password?: string[];
  name?: string[];
};

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const planCode = searchParams.get("planCode");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // Validate with Zod
    const schema = mode === "signin" ? signInSchema : signUpSchema;
    const validation = schema.safeParse({ email, password, name });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors as FieldErrors);
      setIsPending(false);
      return;
    }

    try {
      if (mode === "signin") {
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          toast.error(result.error.message || "Invalid email or password");
          setIsPending(false);
          return;
        }
      } else {
        // Sign up - Better Auth + Commet plugin handles:
        // - Create user in database
        // - Hash password
        // - Create Commet customer (via plugin)
        // - Set session cookies
        const result = await signUp.email({
          name: name || email.split("@")[0],
          email,
          password,
        });

        if (result.error) {
          toast.error(result.error.message || "Failed to create account");
          setIsPending(false);
          return;
        }
      }

      // Redirect to dashboard or checkout if planCode provided
      const redirectTo = planCode ? `/checkout?planCode=${planCode}` : redirect;
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("An error occurred. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-gray-900" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === "signin"
            ? "Sign in to your account"
            : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="border-gray-300"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                className={fieldErrors.email ? "border-red-500" : "border-gray-300"}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={8}
                maxLength={100}
                className={fieldErrors.password ? "border-red-500" : "border-gray-300"}
                placeholder="Enter your password"
              />
              {fieldErrors.password ? (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.password[0]}</p>
              ) : mode === "signup" ? (
                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
              ) : null}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === "signin"
                  ? "New to our platform?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                redirect !== "/dashboard" ? `?redirect=${redirect}` : ""
              }${planCode ? `&planCode=${planCode}` : ""}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {mode === "signin"
                ? "Create an account"
                : "Sign in to existing account"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
