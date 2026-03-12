import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="py-20 sm:py-28">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-[1.1]">
                Build Your SaaS
                <br />
                <span className="font-medium">Faster Than Ever</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Launch with auth, billing, and team management built in. Clone,
                configure, ship.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="h-11 px-6" asChild>
                  <Link href="https://sandbox.commet.co/create?template=better-auth-saas">
                    Create your plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6"
                  asChild
                >
                  <Link href="/sign-up">Try the demo</Link>
                </Button>
              </div>
            </div>
            <Terminal />
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Authentication"
              description="Sign up, sign in, sessions, and user management ready to go."
            />
            <FeatureCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Billing & Subscriptions"
              description="Plans, checkout, customer portal, and usage tracking included."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Team Management"
              description="Invite members, manage seats, and control access out of the box."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>Built with Better Auth and Commet</span>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Terminal() {
  const lines = [
    "git clone <repo-url>",
    "cd better-auth-saas",
    "pnpm install",
    "cp .env.example .env",
    "pnpm db:push",
    "pnpm dev",
  ];

  return (
    <div className="border border-border bg-secondary text-foreground text-sm font-mono">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-5 space-y-2">
        {lines.map((line) => (
          <div key={line}>
            <span className="text-background/50 select-none">$ </span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="bg-secondary p-2.5 w-fit mb-4">{icon}</div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
