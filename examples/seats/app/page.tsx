import { ArrowRight, CreditCard, LayoutList, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 border p-5">
      <Icon className="size-5 text-muted-foreground" />
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-16 px-4 py-20">
        <section className="flex max-w-lg flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Seats Template
          </h1>
          <p className="text-muted-foreground">
            Ship a SaaS product with seat-based pricing. Plans, team management,
            billing portal, and per-seat overage out of the box.
          </p>
          <div className="flex gap-3">
            <Button nativeButton={false} render={<Link href="/sign-up" />}>
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/pricing" />}
            >
              Pricing
            </Button>
          </div>
        </section>

        <section className="grid w-full max-w-2xl gap-4 md:grid-cols-3">
          <FeatureCard
            icon={Users}
            title="Seat-based billing"
            description="Included seats per plan with automatic overage billing for extra members."
          />
          <FeatureCard
            icon={CreditCard}
            title="Billing portal"
            description="Built-in portal for customers to manage plans and invoices."
          />
          <FeatureCard
            icon={LayoutList}
            title="Team management"
            description="Invite members, track seat usage, and manage your team from one dashboard."
          />
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Built with Commet, Better Auth, and Next.js.
      </footer>
    </div>
  );
}
