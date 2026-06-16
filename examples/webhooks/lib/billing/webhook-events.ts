import type { WebhookPayload } from "@commet/node";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { user, webhookEvents } from "@/lib/db/schema";

export async function recordWebhookEvent(payload: WebhookPayload) {
  const externalUserId = payload.data.externalId;
  let localUserId: string | null = null;

  if (typeof externalUserId === "string" && externalUserId.length > 0) {
    const [localUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, externalUserId))
      .limit(1);
    localUserId = localUser?.id ?? null;
  }

  await db.insert(webhookEvents).values({
    event: payload.event,
    commetCustomerId: payload.data.customerId ?? null,
    userId: localUserId,
    payload,
  });
}
