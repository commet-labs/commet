"use client";

import { TeamMembers } from "@/components/billing/team-members";
import { FeatureGate } from "@/components/billing/feature-gate";
import { useSession } from "@/lib/auth/auth-client";

export default function TeamPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const initialMembers = user
    ? [
        {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          role: "owner",
        },
      ]
    : [];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Team Management
      </h1>

      <div className="space-y-6">
        {/* Team Members - uses authClient.seats.add/remove */}
        <TeamMembers
          initialMembers={initialMembers}
          seatType="member"
          maxSeats={5}
        />

        {/* Feature Gate demo - uses authClient.features.canUse */}
        <FeatureGate
          featureCode="team_analytics"
          title="Team Analytics"
          description="View detailed analytics about your team's activity and usage patterns."
        >
          <div className="p-4 rounded-lg bg-muted/50 text-sm text-foreground">
            Team analytics content would appear here when the feature is enabled.
          </div>
        </FeatureGate>
      </div>
    </section>
  );
}
