"use client";

import { removeMemberAction } from "@/actions/team";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Member } from "@/lib/db/schema";
import { Crown, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MemberListProps {
  members: Member[];
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

function MemberRow({ member }: { member: Member }) {
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!confirm(`Remove ${member.name || member.email} from the team?`)) {
      return;
    }

    setIsRemoving(true);

    try {
      const result = await removeMemberAction(member.id);
      if (!result.success) {
        toast.error(result.error || "Failed to remove member");
      } else {
        toast.success("Member removed successfully");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsRemoving(false);
    }
  }

  const isOwner = member.role === "owner";

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {getInitials(member.name, member.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{member.name || member.email}</span>
            {isOwner && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="w-3 h-3" />
                Owner
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isOwner && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No team members yet. Invite someone to get started!
      </div>
    );
  }

  return (
    <div className="divide-y">
      {members.map((member) => (
        <MemberRow key={member.id} member={member} />
      ))}
    </div>
  );
}
