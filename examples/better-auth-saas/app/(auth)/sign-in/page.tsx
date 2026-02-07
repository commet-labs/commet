import { Suspense } from "react";
import { FormAuth } from "@/components/auth/form-auth";

export default function SignInPage() {
  return (
    <Suspense>
      <FormAuth mode="signin" />
    </Suspense>
  );
}
