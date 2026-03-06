import { FormAuth } from "@/components/auth/form-auth";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense>
      <FormAuth mode="signup" />
    </Suspense>
  );
}
