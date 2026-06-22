"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/session";
import { hasUsableSubscription } from "@/lib/billing/entitlements";
import { db } from "@/lib/db/drizzle";
import { getBillingStateForUser } from "@/lib/db/queries";
import {
  ActivityType,
  activityLogs,
  type NewActivityLog,
  user,
} from "@/lib/db/schema";
import { safeRedirectPath } from "@/lib/redirects";
import {
  updateAccountSchema,
  updatePasswordSchema,
} from "@/lib/validations/auth";

type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  [key: string]:
    | string
    | string[]
    | Record<string, string[] | undefined>
    | undefined;
};

async function logActivity(
  userId: string,
  type: ActivityType,
  ipAddress?: string,
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress,
  };
  await db.insert(activityLogs).values(newActivity);
}

export async function getPostAuthRedirect(fallback = "/dashboard") {
  const redirectPath = safeRedirectPath(fallback);
  const currentUser = await getUser();
  if (!currentUser) {
    return "/sign-in";
  }

  if (redirectPath !== "/dashboard") {
    return redirectPath;
  }

  const billing = await getBillingStateForUser(currentUser.id);
  return hasUsableSubscription(billing?.subscriptionStatus)
    ? "/dashboard"
    : "/pricing";
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

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const result = updateAccountSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email } = result.data;

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

  const rawData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = updatePasswordSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = result.data;

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });

    await logActivity(currentUser.id, ActivityType.UPDATE_PASSWORD);

    return { success: "Password updated successfully." };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message || "Failed to update password" };
    }
    return { error: "Failed to update password" };
  }
}
