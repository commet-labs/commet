"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/connection";
import { type Member, member, workspace } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getWorkspaceMembers(): Promise<Member[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return [];
    }

    // Get user's workspace
    const [ws] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.ownerId, session.user.id))
      .limit(1);

    if (!ws) {
      return [];
    }

    // Get active members
    const members = await db
      .select()
      .from(member)
      .where(and(eq(member.workspaceId, ws.id), eq(member.status, "active")))
      .orderBy(member.invitedAt);

    return members;
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return [];
  }
}
