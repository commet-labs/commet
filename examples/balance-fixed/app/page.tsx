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
            Balance Fixed Template
          </h1>
          <p className="text-muted-foreground">
            Ship a product with prepaid balance billing. Fixed unit prices,
            real-dollar transparency, and automatic deduction per usage.
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
            title="Prepaid balance"
            description="Customers pay a base price that becomes usable balance. Usage deducts real dollars."
          />
          <FeatureCard
            icon={Gauge}
            title="Fixed unit prices"
            description="Set a price per API call, per image processed. Clear and predictable."
          />
          <FeatureCard
            icon={Shield}
            title="Auth + billing"
            description="Better Auth with Commet plugin. Customer created on signup, zero friction."
          />
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Built with Commet, Better Auth, and Next.js.
      </footer>
    </div>
  );
}
