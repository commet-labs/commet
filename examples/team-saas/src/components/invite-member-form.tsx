"use client";

import { inviteMemberAction } from "@/actions/invite-member-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await inviteMemberAction(email, name || undefined);

      if (result.success) {
        setSuccess(true);
        setEmail("");
        setName("");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to invite member");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
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
        <div className="space-y-2">
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

      {error && (
        <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg text-sm bg-green-500/10 text-green-500 border border-green-500/20">
          Team member invited successfully!
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="gap-2">
        <UserPlus className="w-4 h-4" />
        {isLoading ? "Inviting..." : "Invite Member"}
      </Button>
    </form>
  );
}
