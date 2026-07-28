import type {
  CustomerStateChangedData,
  PaymentReceivedData,
  PaymentRecoveredData,
  SubscriptionActivatedData,
  SubscriptionReactivatedData,
  UsageRecordedData,
} from "@commet/node";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { type BillingFeature, billingState, user } from "@/lib/db/schema";

function readStringProperty(data: unknown, property: string): string | null {
  if (
    typeof data !== "object" ||
    data === null ||
    !(property in data) ||
    typeof data[property as keyof typeof data] !== "string"
  ) {
    return null;
  }

  return data[property as keyof typeof data] as string;
}

export function readCustomerId(data: unknown): string | null {
  return readStringProperty(data, "customerId");
}

export function readExternalUserId(data: unknown): string | null {
  const candidates = [
    readStringProperty(data, "externalId"),
    readCustomerId(data),
  ];
  return (
    candidates.find(
      (value): value is string => typeof value === "string" && value.length > 0,
    ) ?? null
  );
}

function requireExternalUserId(data: { customerId: string }): string {
  const externalId = readExternalUserId(data);
  if (!externalId) {
    throw new Error(
      `Webhook is missing externalId for customer ${data.customerId}. ` +
        "This template expects customers created via better-auth signup.",
    );
  }
  return externalId;
}

async function resolveLocalUser(data: { customerId: string }) {
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

function readPlanName(data: CustomerStateChangedData): string | null {
  const plan = data.plan;
  if (
    plan &&
    typeof plan === "object" &&
    "name" in plan &&
    typeof (plan as { name?: unknown }).name === "string"
  ) {
    return (plan as { name: string }).name;
  }
  return null;
}

function readFeatures(data: CustomerStateChangedData): BillingFeature[] {
  return data.features;
}

function readUsageRecorded(data: UsageRecordedData): {
  featureCode: string;
  value: number;
} {
  const featureCode = data.featureCode;
  const value = data.value;

  if (typeof featureCode !== "string" || featureCode.length === 0) {
    throw new Error(
      `usage.recorded for customer ${data.customerId} is missing featureCode.`,
    );
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      `usage.recorded for customer ${data.customerId} is missing numeric value.`,
    );
  }

  return { featureCode, value };
}

function applyUsageToFeatures(
  features: BillingFeature[],
  featureCode: string,
  value: number,
): BillingFeature[] {
  return features.map((feature) => {
    if (feature.code !== featureCode || feature.type !== "usage") {
      return feature;
    }

    const unitsUsed = feature.consumption.unitsUsed + value;
    if (feature.consumption.model === "metered") {
      return {
        ...feature,
        consumption: {
          ...feature.consumption,
          unitsUsed,
          remainingUnits:
            feature.consumption.remainingUnits === undefined
              ? undefined
              : Math.max(feature.consumption.remainingUnits - value, 0),
          overage: {
            ...feature.consumption.overage,
            units: Math.max(unitsUsed - feature.consumption.includedUnits, 0),
          },
        },
      };
    }

    if (feature.consumption.model === "credits") {
      return {
        ...feature,
        consumption: {
          ...feature.consumption,
          unitsUsed,
          availableUnits: Math.max(
            feature.consumption.availableUnits - value,
            0,
          ),
        },
      };
    }

    return {
      ...feature,
      consumption: {
        ...feature.consumption,
        unitsUsed,
        ...(feature.consumption.availableUnits === undefined
          ? {}
          : {
              availableUnits: Math.max(
                feature.consumption.availableUnits - value,
                0,
              ),
            }),
      },
    };
  });
}

export async function syncBillingStateFromSnapshot(
  data: CustomerStateChangedData,
) {
  const localUser = await resolveLocalUser(data);

  const status: string | undefined = data.status;
  if (typeof status !== "string") {
    throw new Error(
      `customer.state_changed for customer ${data.customerId} is missing status.`,
    );
  }

  const hasNoSubscription = status === "none" || status === "canceled";
  const syncedState = {
    planName: readPlanName(data),
    subscriptionStatus: status,
    subscriptionId:
      typeof data.subscriptionId === "string" ? data.subscriptionId : null,
    billingInterval:
      typeof data.billingInterval === "string" ? data.billingInterval : null,
    features: readFeatures(data),
    ...(hasNoSubscription ? { currentPeriodEnd: null } : {}),
    updatedAt: new Date(),
  };

  await db
    .insert(billingState)
    .values({ userId: localUser.id, ...syncedState })
    .onConflictDoUpdate({ target: billingState.userId, set: syncedState });
}

export async function recordUsageFromEvent(data: UsageRecordedData) {
  const localUser = await resolveLocalUser(data);
  const { featureCode, value } = readUsageRecorded(data);

  const [state] = await db
    .select({ features: billingState.features })
    .from(billingState)
    .where(eq(billingState.userId, localUser.id))
    .limit(1);

  if (!state) {
    throw new Error(
      `usage.recorded webhook for user ${localUser.id} but no billing state exists. ` +
        "Expected customer.state_changed to have been processed first.",
    );
  }

  await db
    .update(billingState)
    .set({
      features: applyUsageToFeatures(state.features, featureCode, value),
      updatedAt: new Date(),
    })
    .where(eq(billingState.userId, localUser.id));
}

export async function resolveActivatedUserForWelcome(
  data: CustomerStateChangedData,
) {
  const localUser = await resolveLocalUser(data);
  const planName = readPlanName(data);
  if (!planName) {
    throw new Error(
      `subscription_activated snapshot for customer ${data.customerId} is missing plan.name.`,
    );
  }
  return {
    userId: localUser.id,
    userEmail: localUser.email,
    userName: localUser.name,
    planName,
  };
}

export async function recordCurrentPeriod(
  data: SubscriptionActivatedData | SubscriptionReactivatedData,
) {
  const localUser = await resolveLocalUser(data);
  const currentPeriodEnd =
    typeof data.currentPeriodEnd === "string"
      ? new Date(data.currentPeriodEnd)
      : null;

  await db
    .update(billingState)
    .set({ currentPeriodEnd, updatedAt: new Date() })
    .where(eq(billingState.userId, localUser.id));
}

export async function restoreAccessAfterPayment(
  data: PaymentReceivedData | PaymentRecoveredData,
) {
  const localUser = await resolveLocalUser(data);
  await db
    .update(billingState)
    .set({ subscriptionStatus: "active", updatedAt: new Date() })
    .where(
      and(
        eq(billingState.userId, localUser.id),
        eq(billingState.subscriptionStatus, "past_due"),
      ),
    );
}
