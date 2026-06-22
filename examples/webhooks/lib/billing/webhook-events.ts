import type { WebhookPayload } from "@commet/node";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { user, webhookEvents } from "@/lib/db/schema";
import { readExternalUserId } from "./sync";

const staleProcessingWindowMs = 5 * 60 * 1000;

export async function recordWebhookEvent({
  eventId,
  payload,
}: {
  eventId: string;
  payload: WebhookPayload;
}): Promise<"inserted" | "completed" | "processing" | "retry"> {
  const externalUserId = readExternalUserId(payload.data);
  let localUserId: string | null = null;

  if (externalUserId) {
    const [localUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, externalUserId))
      .limit(1);
    localUserId = localUser?.id ?? null;
  }

  const [inserted] = await db
    .insert(webhookEvents)
    .values({
      eventId,
      event: payload.event,
      commetCustomerId: payload.data.customerId ?? null,
      userId: localUserId,
      payload,
    })
    .onConflictDoNothing({ target: webhookEvents.eventId })
    .returning({ id: webhookEvents.id, status: webhookEvents.status });

  if (inserted) {
    return "inserted";
  }

  const [existing] = await db
    .select({
      status: webhookEvents.status,
      updatedAt: webhookEvents.updatedAt,
    })
    .from(webhookEvents)
    .where(eq(webhookEvents.eventId, eventId))
    .limit(1);

  if (existing?.status === "completed") {
    return "completed";
  }

  const updatedAt = existing?.updatedAt;
  if (
    existing?.status === "processing" &&
    updatedAt &&
    Date.now() - updatedAt.getTime() < staleProcessingWindowMs
  ) {
    return "processing";
  }

  await db
    .update(webhookEvents)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(webhookEvents.eventId, eventId));
  return "retry";
}

export async function markWebhookEventCompleted(eventId: string) {
  await db
    .update(webhookEvents)
    .set({
      status: "completed",
      processedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(webhookEvents.eventId, eventId));
}

export async function markWebhookEventFailed(eventId: string) {
  await db
    .update(webhookEvents)
    .set({ status: "failed", updatedAt: new Date() })
    .where(eq(webhookEvents.eventId, eventId));
}
