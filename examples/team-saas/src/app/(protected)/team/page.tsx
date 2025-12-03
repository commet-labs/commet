import { checkSubscriptionStatus } from "@/actions/check-subscription-action";
import { getWorkspaceMembers } from "@/actions/get-workspace-members";
import { InviteMemberForm } from "@/components/invite-member-form";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { MemberList } from "@/components/member-list";
import { SeatUsageCard } from "@/components/seat-usage-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function TeamPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const members = await getWorkspaceMembers();
  const subscription = await checkSubscriptionStatus();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <Link href="/" className="text-2xl font-bold">
              TeamPro
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <form action="/api/auth/sign-out" method="POST">
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Team Members</h1>
              <p className="text-muted-foreground">
                Manage your team and seat allocation
              </p>
            </div>
            <ManageBillingButton />
          </div>

          {/* Seat Usage */}
          <SeatUsageCard
            used={subscription.seatsUsed}
            included={subscription.seatsIncluded}
            overagePrice={subscription.seatOveragePrice}
          />

          {/* Invite Form */}
          {subscription.isPaid && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <InviteMemberForm />
              </CardContent>
            </Card>
          )}

          {/* Member List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberList members={members} />
            </CardContent>
          </Card>

          {!subscription.isPaid && (
            <Card className="border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Subscribe to Invite Team Members
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete your subscription to start inviting team members.
                    </p>
                    <Button asChild>
                      <Link href="/checkout">Subscribe Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
