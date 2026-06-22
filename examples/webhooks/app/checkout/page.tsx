import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { createCheckoutSession } from "@/lib/payments/commet";
import { normalizePlanCode } from "@/lib/plans";

type CheckoutPageProps = {
  searchParams: Promise<{
    planCode?: string | string[];
  }>;
};

function readPlanCode(planCode: string | string[] | undefined): string | null {
  if (!planCode) return null;
  if (Array.isArray(planCode)) {
    return normalizePlanCode(planCode[0] ?? null);
  }
  return normalizePlanCode(planCode);
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const planCode = readPlanCode(params?.planCode);

  if (!planCode) {
    redirect("/pricing?error=missing_plan");
  }

  const successUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard`;

  await createCheckoutSession({ planCode, successUrl });
}
