"use server";

import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import {
  updateAccountSchema,
  updatePasswordSchema,
  deleteAccountSchema,
} from "@/lib/validations/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  [key: string]: string | string[] | Record<string, string[] | undefined> | undefined;
};

export async function signOut() {
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

    return { success: "Password updated successfully." };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message || "Failed to update password" };
    }
    return { error: "Failed to update password" };
  }
}

export async function deleteAccount(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentUser = await getUser();
  if (!currentUser) {
    return { error: "Not authenticated" };
  }

  const rawData = {
    password: formData.get("password") as string,
  };

  const result = deleteAccountSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  await db.delete(user).where(eq(user.id, currentUser.id));

  redirect("/sign-in");
}
