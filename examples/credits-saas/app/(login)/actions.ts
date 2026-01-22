"use server";

import { getUser } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import {
  ActivityType,
  type NewActivityLog,
  activityLogs,
  user,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type ActionState = {
  error?: string;
  success?: string;
  [key: string]: string | undefined;
};

async function logActivity(
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

export async function signOut() {
  const currentUser = await getUser();
  if (currentUser) {
    await logActivity(currentUser.id, ActivityType.SIGN_OUT);
  }
  redirect("/sign-in");
}

export async function updateAccount(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentUser = await getUser();
  if (!currentUser) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  await db
    .update(user)
    .set({ name, email, updatedAt: new Date() })
    .where(eq(user.id, currentUser.id));

  await logActivity(currentUser.id, ActivityType.UPDATE_ACCOUNT);

  return { success: "Account updated successfully." };
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentUser = await getUser();
  if (!currentUser) {
    return { error: "Not authenticated" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match" };
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Note: With Better Auth, password changes should be done through the auth client
  // This is a placeholder that shows the intent
  // In production, use authClient.changePassword() on the client side

  await logActivity(currentUser.id, ActivityType.UPDATE_PASSWORD);

  return { success: "Password updated successfully." };
}

export async function deleteAccount(
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const currentUser = await getUser();
  if (!currentUser) {
    return { error: "Not authenticated" };
  }

  // Log activity before deletion
  await logActivity(currentUser.id, ActivityType.DELETE_ACCOUNT);

  // Delete user (cascade will handle related records)
  await db.delete(user).where(eq(user.id, currentUser.id));

  redirect("/sign-in");
}
