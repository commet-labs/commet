"use server";

import { withTeam } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./commet";

export const checkoutAction = withTeam(async (formData, team) => {
  const planCode = formData.get("planCode") as string;
  await createCheckoutSession({ team: team, planCode });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
