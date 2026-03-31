import { ArrowRight, Gauge, Shield, Zap } from "lucide-react";
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
    <div className="flex flex-col gap-2 rounded-lg border p-5">
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
          <div className="border bg-muted px-3 py-1 text-xs text-muted-foreground">
            Built with Commet
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            AI SaaS Template
          </h1>
          <p className="text-muted-foreground">
            Ship an AI product with usage-based billing in minutes. Authentication,
            token tracking, and payments — all wired up.
          </p>
          <div className="flex gap-3">
            <Button nativeButton={false} render={<Link href="/sign-up" />}>
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/sign-in" />}>
              Sign in
            </Button>
          </div>
        </section>

        <section className="grid w-full max-w-2xl gap-4 md:grid-cols-3">
          <FeatureCard
            icon={Zap}
            title="AI Gateway"
            description="Swap providers without code changes. Track every token automatically."
          />
          <FeatureCard
            icon={Gauge}
            title="Usage billing"
            description="Measure consumption and charge with Commet. Metered, credits, or balance."
          />
          <FeatureCard
            icon={Shield}
            title="Auth + billing"
            description="Better Auth with Commet plugin. Customer created on signup, zero friction."
          />
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Built with Commet, Better Auth, and AI SDK.
      </footer>
    </div>
  );
}
