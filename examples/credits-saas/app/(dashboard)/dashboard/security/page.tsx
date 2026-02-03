"use client";

import { deleteAccount, updatePassword } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { useFormToast } from "@/hooks/use-form-toast";
import { Lock, Trash2 } from "lucide-react";
import { useActionState } from "react";

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteAccount, {});

  useFormToast(passwordState);
  useFormToast(deleteState);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-bold text-foreground mb-6">
        Security Settings
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={passwordAction}>
            <FormField
              id="current-password"
              name="currentPassword"
              type="password"
              label="Current Password"
              autoComplete="current-password"
              required
              minLength={8}
              maxLength={100}
              defaultValue={passwordState.currentPassword}
              error={passwordState.fieldErrors?.currentPassword?.[0]}
            />
            <FormField
              id="new-password"
              name="newPassword"
              type="password"
              label="New Password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={100}
              defaultValue={passwordState.newPassword}
              error={passwordState.fieldErrors?.newPassword?.[0]}
            />
            <FormField
              id="confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              required
              minLength={8}
              maxLength={100}
              defaultValue={passwordState.confirmPassword}
              error={passwordState.fieldErrors?.confirmPassword?.[0]}
            />
            <SubmitButton
              isPending={isPasswordPending}
              pendingText="Updating..."
              className="bg-foreground text-background hover:bg-foreground/90 border border-border/60"
              icon={<Lock className="h-4 w-4" />}
            >
              Update Password
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Account deletion is irreversible. Please proceed with caution.
          </p>
          <form action={deleteAction} className="space-y-4">
            <FormField
              id="delete-password"
              name="password"
              type="password"
              label="Confirm Password"
              required
              minLength={8}
              maxLength={100}
              defaultValue={deleteState.password}
              error={deleteState.fieldErrors?.password?.[0]}
            />
            <SubmitButton
              isPending={isDeletePending}
              pendingText="Deleting..."
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete Account
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
