import { getUser as getAuthUser } from "@/lib/auth/session";
import { and, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { member, workspace } from "./schema";

export async function getUser() {
  return getAuthUser();
}

export async function getUserWorkspace() {
  const currentUser = await getUser();
  if (!currentUser) return null;

  const [ws] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.ownerId, currentUser.id))
    .limit(1);

  return ws || null;
}

export async function getWorkspaceMembers() {
  const ws = await getUserWorkspace();
  if (!ws) return [];

  return db
    .select()
    .from(member)
    .where(and(eq(member.workspaceId, ws.id), eq(member.status, "active")))
    .orderBy(member.invitedAt);
}
