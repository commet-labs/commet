"use server";

import { commet } from "@/lib/commet";
import { getUser } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { member, workspace } from "@/lib/db/schema";
import type { Member } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface SubscriptionStatus {
  isPaid: boolean;
  subscriptionId?: string;
  status?: string;
  planName?: string;
  daysRemaining?: number;
  seatsUsed: number;
  seatsIncluded: number;
  seatOveragePrice?: number;
}

export async function getWorkspaceMembersAction(): Promise<Member[]> {
  try {
    const user = await getUser();
    if (!user) return [];

    const [ws] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.ownerId, user.id))
      .limit(1);

    if (!ws) return [];

    return db
      .select()
      .from(member)
      .where(and(eq(member.workspaceId, ws.id), eq(member.status, "active")))
      .orderBy(member.invitedAt);
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return [];
  }
}

export async function inviteMemberAction(
  email: string,
  name?: string,
): Promise<{ success: boolean; error?: string; willBeCharged?: boolean }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const customer = commet.customer(user.id);

    const canAdd = await customer.features.canUse("member");
    if (!canAdd.success || !canAdd.data?.allowed) {
      return {
        success: false,
        error:
          canAdd.data?.reason ||
          "Seat limit reached. Please upgrade your plan.",
      };
    }

    const [ws] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.ownerId, user.id))
      .limit(1);

    if (!ws) {
      return { success: false, error: "Workspace not found" };
    }

    const [existing] = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.workspaceId, ws.id),
          eq(member.email, email),
          eq(member.status, "active"),
        ),
      )
      .limit(1);

    if (existing) {
      return { success: false, error: "Member already exists in your team" };
    }

    const [newMember] = await db
      .insert(member)
      .values({
        workspaceId: ws.id,
        email,
        name: name || null,
        role: "member",
        status: "active",
      })
      .returning();

    if (!newMember) {
      return { success: false, error: "Failed to add member" };
    }

    try {
      await customer.seats.add("member");
    } catch (error) {
      console.error("Failed to report seat to Commet:", error);
    }

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");

    return {
      success: true,
      willBeCharged: canAdd.data.willBeCharged,
    };
  } catch (error) {
    console.error("Error inviting member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeMemberAction(
  memberId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const [ws] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.ownerId, user.id))
      .limit(1);

    if (!ws) {
      return { success: false, error: "Workspace not found" };
    }

    const [memberToRemove] = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.id, memberId),
          eq(member.workspaceId, ws.id),
          eq(member.status, "active"),
        ),
      )
      .limit(1);

    if (!memberToRemove) {
      return { success: false, error: "Member not found" };
    }

    if (memberToRemove.role === "owner") {
      return { success: false, error: "Cannot remove the workspace owner" };
    }

    await db
      .update(member)
      .set({
        status: "removed",
        removedAt: new Date(),
      })
      .where(eq(member.id, memberId));

    const customer = commet.customer(user.id);
    try {
      await customer.seats.remove("member");
    } catch (error) {
      console.error("Failed to report seat removal to Commet:", error);
    }

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function checkSubscriptionStatusAction(): Promise<SubscriptionStatus> {
  const defaultStatus: SubscriptionStatus = {
    isPaid: false,
    seatsUsed: 0,
    seatsIncluded: 0,
  };

  try {
    const user = await getUser();
    if (!user) return defaultStatus;

    const customer = commet.customer(user.id);

    const result = await customer.subscription.get();
    if (!result.success || !result.data) {
      return defaultStatus;
    }

    const subscription = result.data;
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    const seatResult = await customer.features.get("member");

    return {
      isPaid: isActive,
      subscriptionId: subscription.id,
      status: subscription.status,
      planName: subscription.plan.name,
      daysRemaining: subscription.currentPeriod.daysRemaining,
      seatsUsed: seatResult.data?.current ?? 0,
      seatsIncluded: seatResult.data?.included ?? 0,
      seatOveragePrice: seatResult.data?.overageUnitPrice,
    };
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 429) {
      console.warn("Rate limit reached - this is expected in sandbox with frequent refreshes");
      return defaultStatus;
    }
    console.error("Error checking subscription status:", error);
    return defaultStatus;
  }
}
