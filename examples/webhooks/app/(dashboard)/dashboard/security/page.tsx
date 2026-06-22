"use client";

import { useActionState } from "react";
import { updatePassword } from "@/actions/auth";
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
import { useFormToast } from "@/hooks/use-form-toast";

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  useFormToast(passwordState);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Security</h1>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={passwordAction}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
              />
              {passwordState.fieldErrors?.currentPassword?.[0] && (
                <p className="text-sm text-destructive-foreground">
                  {passwordState.fieldErrors.currentPassword[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
              {passwordState.fieldErrors?.newPassword?.[0] && (
                <p className="text-sm text-destructive-foreground">
                  {passwordState.fieldErrors.newPassword[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
              {passwordState.fieldErrors?.confirmPassword?.[0] && (
                <p className="text-sm text-destructive-foreground">
                  {passwordState.fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPasswordPending}>
              {isPasswordPending ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
