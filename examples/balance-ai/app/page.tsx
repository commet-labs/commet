import { ArrowRight, DollarSign, Gauge, Shield } from "lucide-react";
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
            Balance AI Template
          </h1>
          <p className="text-muted-foreground">
            Ship an AI product with balance-based billing. Real cost from the AI
            model catalog, your margin on top, automatic deduction per request.
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
            icon={DollarSign}
            title="AI cost + margin"
            description="Real cost per model from Commet's catalog. Set your margin per plan."
          />
          <FeatureCard
            icon={Gauge}
            title="Balance billing"
            description="Customers prepay a balance. Each AI request deducts cost + margin automatically."
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
