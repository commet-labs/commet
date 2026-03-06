import { FormAuth } from "@/components/auth/form-auth";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense>
      <FormAuth mode="signin" />
    </Suspense>
  );
}
