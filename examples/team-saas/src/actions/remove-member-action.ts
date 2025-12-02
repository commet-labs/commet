"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { db } from "@/lib/db/connection";
import { member, workspace } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface RemoveMemberResult {
  success: boolean;
  error?: string;
}

export async function removeMemberAction(
  memberId: string,
): Promise<RemoveMemberResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
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

    // Get the member
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

    // Cannot remove the owner
    if (memberToRemove.role === "owner") {
      return { success: false, error: "Cannot remove the workspace owner" };
    }

    // Soft delete member
    await db
      .update(member)
      .set({
        status: "removed",
        removedAt: new Date(),
      })
      .where(eq(member.id, memberId));

    // Report seat removal to Commet
    try {
      await commet.seats.remove({
        externalId: session.user.id,
        seatType: "member",
        count: 1,
      });
    } catch (error) {
      // Log but don't fail - seat can be synced later
      console.error("Failed to report seat removal to Commet:", error);
    }

    revalidatePath("/team");
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

