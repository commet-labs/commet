import { CreditCard, LogOut, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardInnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside className="flex w-56 flex-col border-r bg-sidebar p-4">
        <Link
          href="/dashboard"
          className="mb-6 text-lg font-semibold tracking-tight"
        >
          AI SaaS
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/dashboard">
              <MessageSquare className="size-4" />
              Chat
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/dashboard/billing">
              <CreditCard className="size-4" />
              Billing
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/dashboard/settings">
              <Settings className="size-4" />
              Settings
            </Link>
          </Button>
        </nav>
        <Separator className="my-2" />
        <form action="/api/auth/sign-out" method="POST">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            type="submit"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </aside>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
