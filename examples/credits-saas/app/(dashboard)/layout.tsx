"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { CreditCard, Home, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { hasActiveSubscriptionAction } from "@/actions/subscription";

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <div className="h-9 w-9 bg-gray-100 rounded-full animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Button asChild className="rounded-full">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    );
  }

  const user = session.user;

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ""} src={user.image || undefined} />
          <AvatarFallback>
            {(user.name || user.email)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/billing" className="flex w-full items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const { data: session, isPending } = useSession();
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPending && session?.user) {
      hasActiveSubscriptionAction().then((result) => {
        if (result.success) {
          setHasActiveSubscription(result.hasActiveSubscription);
        }
      });
    } else if (!session?.user) {
      setHasActiveSubscription(false);
    }
  }, [session?.user, isPending]);

  // Show Pricing link if:
  // 1. User is not logged in, OR
  // 2. User is logged in but doesn't have an active subscription
  const shouldShowPricing = !isPending && (!session?.user || hasActiveSubscription === false);

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="bg-gray-900 rounded-lg p-1 mr-2">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CreditsSaaS</span>
        </Link>
        <div className="flex items-center space-x-6">
          {shouldShowPricing ? (
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
          ) : null}
          <Suspense
            fallback={
              <div className="h-9 w-9 bg-gray-100 rounded-full animate-pulse" />
            }
          >
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
