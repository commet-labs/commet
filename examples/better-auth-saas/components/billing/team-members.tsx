"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { Trash2, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";

interface Member {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface TeamMembersProps {
  initialMembers: Member[];
  seatType: string;
  maxSeats?: number;
}

export function TeamMembers({
  initialMembers,
  seatType,
  maxSeats,
}: TeamMembersProps) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const seatsUsed = members.length;
  const canAddMore = !maxSeats || seatsUsed < maxSeats;

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !canAddMore) return;

    setError("");
    startTransition(async () => {
      try {
        // Using authClient.seats.add from the Commet plugin
        const result = await authClient.seats.add({
          seatType,
          count: 1,
        });

        if (result.error) {
          setError(result.error.message || "Failed to add member");
          return;
        }

        // Add to local state (in real app, would persist to DB)
        setMembers((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            email: email.trim(),
            name: email.split("@")[0],
            role: "member",
          },
        ]);
        setEmail("");
      } catch (err) {
        setError("Failed to add team member");
        console.error(err);
      }
    });
  }

  async function handleRemoveMember(memberId: string) {
    startTransition(async () => {
      try {
        // Using authClient.seats.remove from the Commet plugin
        const result = await authClient.seats.remove({
          seatType,
          count: 1,
        });

        if (result.error) {
          setError(result.error.message || "Failed to remove member");
          return;
        }

        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } catch (err) {
        setError("Failed to remove team member");
        console.error(err);
      }
    });
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team seats using{" "}
              <code className="text-xs">authClient.seats</code>
            </CardDescription>
          </div>
          <Badge variant="outline">
            {seatsUsed} / {maxSeats || "\u221e"} seats
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending || !canAddMore}
          />
          <Button type="submit" disabled={isPending || !canAddMore || !email}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>

        {error && (
          <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {!canAddMore && (
          <div className="p-3 rounded-lg text-sm bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
            You've reached your seat limit. Upgrade your plan to add more team
            members.
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{member.name || member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{member.role}</Badge>
                {member.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Adding members uses{" "}
          <code className="text-xs">authClient.seats.add()</code>, removing uses{" "}
          <code className="text-xs">authClient.seats.remove()</code>
        </p>
      </CardContent>
    </Card>
  );
}
