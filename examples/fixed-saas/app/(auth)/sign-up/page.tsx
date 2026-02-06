import { Suspense } from "react";
import { FormAuth } from "@/components/auth/form-auth";

export default function SignUpPage() {
  return (
    <Suspense>
      <FormAuth mode="signup" />
    </Suspense>
  );
}
