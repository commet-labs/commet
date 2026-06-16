import type { WebhookData } from "@commet/node";
import { eq } from "drizzle-orm";
import { commet } from "@/lib/commet";
import { db } from "@/lib/db/drizzle";
import { FREE_BILLING_STATE } from "@/lib/db/queries";
import { billingState, user } from "@/lib/db/schema";
import { resolveEntitlementsForPlan } from "./entitlements";

export function requireExternalUserId(data: WebhookData): string {
  const externalId = data.externalId;
  if (typeof externalId !== "string" || externalId.length === 0) {
    throw new Error(
      `Webhook is missing externalId for customer ${data.customerId}. ` +
        "This template expects customers created via better-auth signup.",
    );
  }
  return externalId;
}

async function resolveLocalUser(data: WebhookData) {
  const userId = requireExternalUserId(data);
  const [localUser] = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!localUser) {
    throw new Error(
      `No local user found for externalId "${userId}" (customer ${data.customerId}).`,
    );
  }
  return localUser;
}

function requirePlanNameFromCurrentPlan(data: WebhookData): string {
  const currentPlan = data.currentPlan;
  if (
    typeof currentPlan === "object" &&
    currentPlan !== null &&
    "name" in currentPlan &&
    typeof currentPlan.name === "string"
  ) {
    return currentPlan.name;
  }
  throw new Error(
    `subscription.plan_changed webhook is missing currentPlan for customer ${data.customerId}.`,
  );
}

export async function activateSubscriptionForUser(data: WebhookData) {
  const localUser = await resolveLocalUser(data);

  const activeSubscription = await commet.subscriptions.getActive({
    customerId: localUser.id,
  });
  if (!activeSubscription.success || !activeSubscription.data) {
    throw new Error(
      `No active subscription found for user ${localUser.id} after subscription.activated webhook.`,
    );
  }

  const planName = activeSubscription.data.plan.name;
  const entitlements = resolveEntitlementsForPlan(planName);
  const syncedState = {
    planKey: entitlements.planKey,
    planName,
    subscriptionId: activeSubscription.data.id,
    subscriptionStatus: activeSubscription.data.status,
    isPastDue: false,
    currentPeriodEnd: activeSubscription.data.currentPeriod
      ? new Date(activeSubscription.data.currentPeriod.end)
      : null,
    updatedAt: new Date(),
  };

  await db
    .insert(billingState)
    .values({ userId: localUser.id, ...syncedState })
    .onConflictDoUpdate({ target: billingState.userId, set: syncedState });

  return {
    userId: localUser.id,
    userEmail: localUser.email,
    userName: localUser.name,
    planName,
  };
}

export async function deactivateSubscriptionForUser(data: WebhookData) {
  const localUser = await resolveLocalUser(data);
  const freeState = { ...FREE_BILLING_STATE, updatedAt: new Date() };

  await db
    .insert(billingState)
    .values({ userId: localUser.id, ...freeState })
    .onConflictDoUpdate({ target: billingState.userId, set: freeState });
}

export async function applyPlanChangeForUser(data: WebhookData) {
  const localUser = await resolveLocalUser(data);
  const planName = requirePlanNameFromCurrentPlan(data);
  const entitlements = resolveEntitlementsForPlan(planName);

  await db
    .update(billingState)
    .set({
      planKey: entitlements.planKey,
      planName,
      updatedAt: new Date(),
    })
    .where(eq(billingState.userId, localUser.id));
}

export async function markPaymentFailedForUser(data: WebhookData) {
  const localUser = await resolveLocalUser(data);
  const updated = await db
    .update(billingState)
    .set({ isPastDue: true, updatedAt: new Date() })
    .where(eq(billingState.userId, localUser.id))
    .returning({ userId: billingState.userId });
  if (updated.length === 0) {
    throw new Error(
      `payment.failed webhook for user ${localUser.id} but no billing state exists. ` +
        "Expected subscription.activated to have been processed first.",
    );
  }
}

export async function clearPastDueForUser(data: WebhookData) {
  const localUser = await resolveLocalUser(data);
  await db
    .update(billingState)
    .set({ isPastDue: false, updatedAt: new Date() })
    .where(eq(billingState.userId, localUser.id));
}
