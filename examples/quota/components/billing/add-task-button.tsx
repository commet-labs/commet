"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createTaskAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";

export function AddTaskButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd() {
    setIsLoading(true);
    try {
      const result = await createTaskAction();
      if (result.success) {
        toast.success("Task added");
      } else {
        toast.error(result.error || "Failed to add task");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleAdd} disabled={isLoading} className="self-start">
      <Plus className="size-4" />
      {isLoading ? "Adding..." : "Add task"}
    </Button>
  );
}
