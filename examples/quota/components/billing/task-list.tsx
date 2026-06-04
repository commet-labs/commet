"use client";

import { Circle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTaskAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/db/schema";
import { enqueueMutation } from "@/lib/mutation-queue";

interface TaskListProps {
  tasks: Task[];
}

function TaskRow({ task }: { task: Task }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await enqueueMutation(() => deleteTaskAction(task.id));
      if (!result.success) {
        toast.error(result.error || "Failed to delete task");
      } else {
        toast.success("Task deleted");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <Circle className="size-3.5 text-muted-foreground" />
        <span className="font-medium">{task.title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No tasks yet. Create one to start using your quota.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}
