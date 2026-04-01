import { Users } from "lucide-react";
import {
  checkSubscriptionStatusAction,
  getWorkspaceMembersAction,
} from "@/actions/team";
import { InviteMemberForm } from "@/components/billing/invite-member-form";
import { MemberList } from "@/components/billing/member-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TeamPage() {
  const [status, members] = await Promise.all([
    checkSubscriptionStatusAction(),
    getWorkspaceMembersAction(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Team</h1>
        <p className="text-sm text-muted-foreground">
          Manage your team members and seat usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seat Usage</CardTitle>
          <CardDescription>
            {status.seatsUsed} of {status.seatsIncluded} included seats used.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${
                status.seatsUsed > status.seatsIncluded
                  ? "bg-yellow-500"
                  : "bg-primary"
              }`}
              style={{
                width: `${Math.min(
                  (status.seatsUsed / Math.max(status.seatsIncluded, 1)) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          {status.seatOveragePrice !== undefined &&
            status.seatOveragePrice > 0 && (
              <p className="text-xs text-muted-foreground">
                Extra seats: ${(status.seatOveragePrice / 100).toFixed(0)}/mo
                each
              </p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>Add a new member to your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteMemberForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList members={members} />
        </CardContent>
      </Card>
    </div>
  );
}
