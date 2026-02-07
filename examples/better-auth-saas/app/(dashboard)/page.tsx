import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  ToggleRight,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const stackList = [
    { name: "Commet" },
    { name: "Better Auth" },
    { name: "Next.js" },
    { name: "Drizzle ORM" },
    { name: "Tailwind CSS" },
  ];

  return (
    <main className="bg-card">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-foreground text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>@commet/better-auth Plugin Showcase</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-5xl font-extrabold text-foreground tracking-tight sm:text-6xl md:text-7xl">
                <span className="block">Better Auth + Commet</span>
                <span className="block">Billing Integration</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                This example demonstrates the @commet/better-auth plugin —
                seamless billing integration with seats, usage tracking, and
                feature flags.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg flex-1"
                asChild
              >
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-8 text-lg border-border flex-1"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="w-full max-w-3xl mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground text-center mb-4">
                Built with
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {stackList.map((stack) => (
                  <div
                    key={stack.name}
                    className="flex items-center gap-2 px-4 py-2 border border-border/60 bg-card/70 text-sm text-foreground"
                  >
                    <span className="font-medium">{stack.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Plugin Features
            </h2>
            <p className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything through authClient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Seat Management"
              description="Add and remove team members with authClient.seats."
            />
            <FeatureCard
              icon={<ToggleRight className="w-6 h-6" />}
              title="Feature Flags"
              description="Gate features with authClient.features.canUse()."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Usage Tracking"
              description="Track metered usage with authClient.usage.track()."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Customer Portal"
              description="Self-service billing with authClient.customer.portal()."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-border">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-card/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Ready to add billing to your app?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Stop building billing from scratch. Use the @commet/better-auth
                plugin to add subscriptions, seats, and usage tracking in
                minutes.
              </p>
              <Button
                size="lg"
                className="bg-card text-foreground hover:bg-accent rounded-xl h-14 px-10 text-lg font-semibold shadow-lg"
                asChild
              >
                <Link href="/sign-up">Start Building Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
