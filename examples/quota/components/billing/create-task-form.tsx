"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createTaskAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QUICK_TASKS = ["Fix login bug", "Write API docs", "Review pull request"];

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function create(taskTitle: string) {
    const trimmed = taskTitle.trim();
    if (!trimmed) {
      toast.error("Task title is required");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createTaskAction(trimmed);
      if (result.success) {
        toast.success(`Created "${trimmed}"`);
        setTitle("");
      } else {
        toast.error(result.error || "Failed to create task");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create(title);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Quick add
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_TASKS.map((quick) => (
            <Button
              key={quick}
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => create(quick)}
            >
              <Plus className="size-4" />
              {quick}
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Task title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Ship the landing page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="self-start">
          <Plus className="size-4" />
          {isLoading ? "Creating..." : "Create task"}
        </Button>
      </form>
    </div>
  );
}
