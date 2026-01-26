"use client";

import { updateAccount } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormToast } from "@/hooks/use-form-toast";
import { useSession } from "@/lib/auth/auth-client";
import { useActionState } from "react";
import { Suspense } from "react";

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm({
  state,
  nameValue = "",
  emailValue = "",
}: AccountFormProps) {
  return (
    <>
      <FormField
        id="name"
        name="name"
        label="Name"
        placeholder="Enter your name"
        defaultValue={state.name || nameValue}
        error={state.fieldErrors?.name?.[0]}
        required
      />
      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        defaultValue={emailValue}
        error={state.fieldErrors?.email?.[0]}
        required
      />
    </>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ""}
      emailValue={user?.email ?? ""}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {},
  );

  useFormToast(state);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <Suspense fallback={<AccountForm state={state} />}>
              <AccountFormWithData state={state} />
            </Suspense>
            <SubmitButton
              isPending={isPending}
              pendingText="Saving..."
              className="bg-gray-900 hover:bg-black text-white"
            >
              Save Changes
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
