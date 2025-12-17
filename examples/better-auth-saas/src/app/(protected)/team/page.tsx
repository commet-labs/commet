import { NavHeader } from "@/components/nav-header";
import { TeamMembers } from "@/components/team-members";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/connection";
import { member } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Users } from "lucide-react";
import { headers } from "next/headers";

export default async function TeamPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // Get team members from database
  const teamMembers = user
    ? await db.select().from(member).where(eq(member.ownerId, user.id))
    : [];

  // Transform to expected format
  const members = [
    // Add current user as owner
    {
      id: user?.id || "",
      email: user?.email || "",
      name: user?.name || undefined,
      role: "owner",
    },
    // Add other team members
    ...teamMembers.map((m) => ({
      id: m.id,
      email: m.email,
      name: m.name || undefined,
      role: m.role || "member",
    })),
  ];

  return (
    <div className="min-h-screen">
      <NavHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team seats using the{" "}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                authClient.seats
              </code>{" "}
              API.
            </p>
          </div>

          {/* Seats Overview */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Seat-Based Billing</CardTitle>
              </div>
              <CardDescription>
                Each team member consumes a seat. Commet tracks seat usage and
                bills accordingly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-2xl font-bold">{members.length}</p>
                  <p className="text-sm text-muted-foreground">Current Seats</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Max Seats</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-2xl font-bold">$10</p>
                  <p className="text-sm text-muted-foreground">Per Seat/mo</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-2xl font-bold">${members.length * 10}</p>
                  <p className="text-sm text-muted-foreground">Total/mo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <TeamMembers
            initialMembers={members}
            seatType="member"
            maxSeats={5}
          />

          {/* API Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seats API Reference</CardTitle>
              <CardDescription>
                Available methods on{" "}
                <code className="text-xs">authClient.seats</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>GET</Badge>
                    <code className="text-sm">seats.list()</code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    List all seat types and counts
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>POST</Badge>
                    <code className="text-sm">
                      seats.add(&#123; seatType, count &#125;)
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add seats of a specific type
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">POST</Badge>
                    <code className="text-sm">
                      seats.remove(&#123; seatType, count &#125;)
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remove seats of a specific type
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">POST</Badge>
                    <code className="text-sm">
                      seats.set(&#123; seatType, count &#125;)
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set exact seat count
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

