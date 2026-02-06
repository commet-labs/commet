import { createCheckoutSession } from "@/lib/payments/commet";
import { redirect } from "next/navigation";

type CheckoutPageProps = {
  searchParams: Promise<{
    planCode?: string | string[];
  }>;
};

function normalizePlanCode(
  planCode: string | string[] | undefined,
): string | null {
  if (!planCode) return null;
  if (Array.isArray(planCode)) {
    return planCode[0] ?? null;
  }
  return planCode.trim() || null;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const planCode = normalizePlanCode(params?.planCode);

  if (!planCode) {
    redirect("/pricing?error=missing_plan");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || "http://localhost:3002";
  const successUrl = `${baseUrl}/dashboard`;

  await createCheckoutSession({ planCode, successUrl });
}
