import { CreditCard, Home, Lock } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { Separator } from "@/components/ui/separator";
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

export default function DashboardInnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <aside className="sticky top-12 flex h-[calc(100dvh-3rem)] w-56 flex-col border-r bg-sidebar px-2 py-4">
        <nav className="flex flex-1 flex-col gap-1">
          <NavLink href="/dashboard">
            <Home className="size-4" />
            Overview
          </NavLink>
          <NavLink href="/dashboard/billing">
            <CreditCard className="size-4" />
            Billing
          </NavLink>
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
  );
}
