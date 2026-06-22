import { desc, eq } from "drizzle-orm";
import { getUser as getAuthUser } from "@/lib/auth/session";
import { db } from "./drizzle";
import {
  activityLogs,
  type BillingState,
  billingState,
  user,
  webhookEvents,
} from "./schema";

export async function getUser() {
  return getAuthUser();
}

export async function getBillingStateForUser(
  userId: string,
): Promise<BillingState | null> {
  const [stateRow] = await db
    .select()
    .from(billingState)
    .where(eq(billingState.userId, userId))
    .limit(1);

  return stateRow ?? null;
}

export async function getRecentWebhookEvents() {
  const currentUser = await getUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: webhookEvents.id,
      event: webhookEvents.event,
      commetCustomerId: webhookEvents.commetCustomerId,
      payload: webhookEvents.payload,
      receivedAt: webhookEvents.receivedAt,
    })
    .from(webhookEvents)
    .where(eq(webhookEvents.userId, currentUser.id))
    .orderBy(desc(webhookEvents.receivedAt), desc(webhookEvents.id))
    .limit(50);
}

export async function getActivityLogs() {
  const currentUser = await getUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: user.name,
    })
    .from(activityLogs)
    .leftJoin(user, eq(activityLogs.userId, user.id))
    .where(eq(activityLogs.userId, currentUser.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}
