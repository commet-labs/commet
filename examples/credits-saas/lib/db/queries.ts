import { getUser as getAuthUser } from "@/lib/auth/session";
import { desc, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, user } from "./schema";

export async function getUser() {
  return getAuthUser();
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
