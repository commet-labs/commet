import { commet } from "@/lib/commet";
import { getUser } from "@/lib/db/queries";
import type { Team } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export async function createCheckoutSession({
  team,
  planCode,
}: {
  team: Team | null;
  planCode: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&planCode=${planCode}`);
  }

  // Ensure customer exists in Commet
  await commet.customers.create({
    email: user.email,
    externalId: team.id.toString(),
    fullName: user.name || undefined,
  });

  // Create subscription via Commet
  // planCode is dynamically passed, so we use planId instead for type safety
  const result = await commet.subscriptions.create({
    externalId: team.id.toString(),
    planId: planCode,
  });

  if (!result.success || !result.data?.checkoutUrl) {
    throw new Error(result.error || "Failed to create checkout session");
  }

  redirect(result.data.checkoutUrl);
}

export async function createCustomerPortalSession(team: Team) {
  const result = await commet.portal.getUrl({
    externalId: team.id.toString(),
  });

  if (!result.success || !result.data?.portalUrl) {
    throw new Error(result.error || "Failed to create portal session");
  }

  return { url: result.data.portalUrl };
}
