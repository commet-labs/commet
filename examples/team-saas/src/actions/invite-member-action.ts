"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { db } from "@/lib/db/connection";
import { member, workspace } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface InviteMemberResult {
  success: boolean;
  error?: string;
  willBeCharged?: boolean;
  member?: {
    id: string;
    email: string;
    name: string | null;
  };
}

export async function inviteMemberAction(
  email: string,
  name?: string,
): Promise<InviteMemberResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Use customer-scoped API
    const customer = commet.customer(session.user.id);

    // Check if can add another seat
    const canAdd = await customer.features.canUse("team_members");
    if (!canAdd.success || !canAdd.data?.allowed) {
      return {
        success: false,
        error:
          canAdd.data?.reason ||
          "Seat limit reached. Please upgrade your plan.",
      };
    }

    // Get user's workspace
    const [ws] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.ownerId, session.user.id))
      .limit(1);

    if (!ws) {
      return { success: false, error: "Workspace not found" };
    }

    // Check if member already exists
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

    // Add member to database
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

    // Report seat to Commet using customer-scoped API
    try {
      await customer.seats.add("member");
    } catch (error) {
      // Log but don't fail - seat can be synced later
      console.error("Failed to report seat to Commet:", error);
    }

    revalidatePath("/team");
    revalidatePath("/dashboard");

    return {
      success: true,
      willBeCharged: canAdd.data.willBeCharged,
      member: {
        id: newMember.id,
        email: newMember.email,
        name: newMember.name,
      },
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
