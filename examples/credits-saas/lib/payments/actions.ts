"use server";

import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function checkoutAction(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const planCode = formData.get("planCode") as string;
  redirect(`/checkout?planCode=${planCode}`);
}

export async function customerPortalAction() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  redirect("/dashboard/billing");
}
