"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { RATE_SCALE } from "@/lib/billing";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";
import { db } from "@/lib/db/drizzle";
import { type Task, task, workspace } from "@/lib/db/schema";

const TASKS_FEATURE_CODE = "tasks";

export interface TaskQuotaStatus {
  isPaid: boolean;
  subscriptionId?: string;
  status?: string;
  planName?: string;
  daysRemaining?: number;
  used: number;
  included: number;
  billed: number;
  unlimited: boolean;
  overageEnabled: boolean;
  overagePricePerTask?: number;
}

async function getOwnedWorkspace(userId: string) {
  const [ownedWorkspace] = await db
    .select()
    .from(workspace)
    .where(eq(workspace.ownerId, userId))
    .limit(1);
  return ownedWorkspace;
}

export async function getTasksAction(): Promise<Task[]> {
  const user = await getUser();
  if (!user) return [];

  const ownedWorkspace = await getOwnedWorkspace(user.id);
  if (!ownedWorkspace) return [];

  return db
    .select()
    .from(task)
    .where(eq(task.workspaceId, ownedWorkspace.id))
    .orderBy(desc(task.createdAt));
}

export async function createTaskAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const ownedWorkspace = await getOwnedWorkspace(user.id);
    if (!ownedWorkspace) {
      return { success: false, error: "Workspace not found" };
    }

    const existingTasks = await db
      .select({ id: task.id })
      .from(task)
      .where(eq(task.workspaceId, ownedWorkspace.id));
    const title = `Task ${existingTasks.length + 1}`;

    const [newTask] = await db
      .insert(task)
      .values({ workspaceId: ownedWorkspace.id, title })
      .returning();

    if (!newTask) {
      return { success: false, error: "Failed to save task" };
    }

    try {
      await commet.quota.add({
        customerId: user.id,
        featureCode: TASKS_FEATURE_CODE,
        count: 1,
      });
    } catch (error) {
      await db.delete(task).where(eq(task.id, newTask.id));
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to reserve a task",
      };
    }

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteTaskAction(
  taskId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const ownedWorkspace = await getOwnedWorkspace(user.id);
    if (!ownedWorkspace) {
      return { success: false, error: "Workspace not found" };
    }

    const [taskToDelete] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, taskId), eq(task.workspaceId, ownedWorkspace.id)))
      .limit(1);

    if (!taskToDelete) {
      return { success: false, error: "Task not found" };
    }

    await db.delete(task).where(eq(task.id, taskId));

    try {
      await commet.quota.remove({
        customerId: user.id,
        featureCode: TASKS_FEATURE_CODE,
        count: 1,
      });
    } catch (error) {
      await db.insert(task).values(taskToDelete);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to release the task",
      };
    }

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getTaskQuotaStatusAction(): Promise<TaskQuotaStatus> {
  const defaultStatus: TaskQuotaStatus = {
    isPaid: false,
    used: 0,
    included: 0,
    billed: 0,
    unlimited: false,
    overageEnabled: false,
  };

  try {
    const user = await getUser();
    if (!user) return defaultStatus;

    const subscriptionResult = await commet.subscriptions.getActive({
      customerId: user.id,
    });
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return defaultStatus;
    }

    const subscription = subscriptionResult.data;
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    if (!isActive) {
      return {
        ...defaultStatus,
        status: subscription.status,
        planName: subscription.plan.name,
      };
    }

    const feature = await commet.features.get({
      customerId: user.id,
      code: TASKS_FEATURE_CODE,
    });
    const access = feature.data;
    const overageRate = access?.overageUnitPrice;

    return {
      isPaid: isActive,
      subscriptionId: subscription.id,
      status: subscription.status,
      planName: subscription.plan.name,
      daysRemaining: subscription.currentPeriod.daysRemaining,
      used: access?.current ?? 0,
      included: access?.included ?? 0,
      billed: access?.billedQuantity ?? 0,
      unlimited: access?.unlimited ?? false,
      overageEnabled: access?.overageEnabled ?? false,
      overagePricePerTask: overageRate ? overageRate / RATE_SCALE : undefined,
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 429
    ) {
      console.warn("Rate limit reached - expected with frequent refreshes");
      return defaultStatus;
    }
    console.error("Error checking task quota status:", error);
    return defaultStatus;
  }
}
