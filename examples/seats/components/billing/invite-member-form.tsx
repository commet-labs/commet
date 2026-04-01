"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { inviteMemberAction } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await inviteMemberAction(email, name || undefined);

      if (result.success) {
        toast.success("Team member invited successfully!");
        setEmail("");
        setName("");
      } else {
        toast.error(result.error || "Failed to invite member");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="team@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="self-start">
        <UserPlus className="size-4" />
        {isLoading ? "Inviting..." : "Invite Member"}
      </Button>
    </form>
  );
}
