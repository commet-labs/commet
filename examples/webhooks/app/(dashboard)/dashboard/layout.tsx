import { CreditCard, Home, Lock, Tags, Webhook } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PastDueBanner } from "@/components/past-due-banner";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/auth/session";
import { hasUsableSubscription } from "@/lib/billing/entitlements";
import { getBillingStateForUser } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-muted",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export default async function DashboardInnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const billing = await getBillingStateForUser(user.id);
  const hasPlan = hasUsableSubscription(billing?.subscriptionStatus);

  return (
    <div className="flex flex-1 flex-col">
      {billing?.subscriptionStatus === "past_due" && <PastDueBanner />}
      <div className="flex flex-1">
        <aside className="sticky top-12 flex h-[calc(100dvh-3rem)] w-56 flex-col border-r bg-sidebar px-2 py-4">
          <nav className="flex flex-1 flex-col gap-1">
            <NavLink href="/dashboard">
              <Home className="size-4" />
              Overview
            </NavLink>
            <NavLink href="/dashboard/events">
              <Webhook className="size-4" />
              Events
            </NavLink>
            <NavLink href="/dashboard/billing">
              <CreditCard className="size-4" />
              Billing
            </NavLink>
            {!hasPlan && (
              <NavLink href="/pricing">
                <Tags className="size-4" />
                Pricing
              </NavLink>
            )}
            <NavLink href="/dashboard/security">
              <Lock className="size-4" />
              Security
            </NavLink>
          </nav>
          <Separator className="my-2" />
          <SignOutButton />
        </aside>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
