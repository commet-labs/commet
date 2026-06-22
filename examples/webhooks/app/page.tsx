import { ArrowRight, Bell, Mail, Webhook } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/session";

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

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-16 px-4 py-20">
        <section className="flex max-w-lg flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Webhooks Template
          </h1>
          <p className="text-muted-foreground">
            Commet notifies, your app reacts. Provisioning, dunning UX, and
            local entitlements kept in sync by webhook events.
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
            icon={Webhook}
            title="Real-time sync"
            description="Local billing state updated by subscription and payment events. See them arrive live in the dashboard."
          />
          <FeatureCard
            icon={Bell}
            title="Dunning UX"
            description="Failed payments pause premium features with an in-app banner instead of a raw API error."
          />
          <FeatureCard
            icon={Mail}
            title="Lifecycle hooks"
            description="Welcome email and team alerts fired from subscription.activated — the parts Commet leaves to you."
          />
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Built with Commet, Better Auth, and Next.js.
      </footer>
    </div>
  );
}
