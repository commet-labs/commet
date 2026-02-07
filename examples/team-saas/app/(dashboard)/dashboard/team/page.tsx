import { checkSubscriptionStatusAction, getWorkspaceMembersAction } from "@/actions/team";
import { SeatUsageCard } from "@/components/billing/seat-usage-card";
import { InviteMemberForm } from "@/components/billing/invite-member-form";
import { MemberList } from "@/components/billing/member-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function TeamPage() {
  const status = await checkSubscriptionStatusAction();
  const members = await getWorkspaceMembersAction();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-bold text-foreground mb-6">
        Team Management
      </h1>

      {status.isPaid ? (
        <div className="space-y-6">
          <SeatUsageCard
            used={status.seatsUsed}
            included={status.seatsIncluded}
            overagePrice={status.seatOveragePrice}
          />

          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteMemberForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MemberList members={members} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <svg
                className="h-10 w-10 text-muted-foreground shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  Subscribe to Invite Team Members
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your subscription to start inviting team members.
                </p>
                <Button asChild>
                  <Link href="/pricing">Subscribe Now</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
