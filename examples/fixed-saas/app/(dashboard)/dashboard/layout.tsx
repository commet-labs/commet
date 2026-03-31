import {
  Activity,
  CreditCard,
  Home,
  Lock,
  LogOut,
} from "lucide-react";
import Link from "next/link";
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
        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted",
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
    <div className="flex min-h-dvh">
      <aside className="flex w-56 flex-col border-r bg-sidebar p-4">
        <nav className="flex flex-1 flex-col gap-1">
          <NavLink href="/dashboard">
            <Home className="size-4" />
            Overview
          </NavLink>
          <NavLink href="/dashboard/billing">
            <CreditCard className="size-4" />
            Billing
          </NavLink>
          <NavLink href="/dashboard/activity">
            <Activity className="size-4" />
            Activity
          </NavLink>
          <NavLink href="/dashboard/security">
            <Lock className="size-4" />
            Security
          </NavLink>
        </nav>
        <Separator className="my-2" />
        <form action="/api/auth/sign-out" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
