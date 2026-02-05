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
import { ArrowLeft, CreditCard, Home, LogOut, Zap } from "lucide-react";
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
    return <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Button asChild className="rounded-xl">
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

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="bg-primary rounded-lg p-1 mr-2">
        <Zap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-foreground">FixedSaaS</span>
    </Link>
  );
}

function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}

interface HeaderProps {
  variant?: "default" | "auth";
}

export function Header({ variant = "default" }: HeaderProps) {
  const { data: session, isPending } = useSession();
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);

  useEffect(() => {
    console.log(variant);
    if (variant === "auth") return 

    if (!isPending && session?.user) {
      hasActiveSubscriptionAction().then((result) => {
        if (result.success) {
          setHasActiveSubscription(result.hasActiveSubscription);
        }
      });
    } else if (!session?.user) {
      setHasActiveSubscription(false);
    }
  }, [session?.user, isPending, variant]);

  // Show Pricing link if:
  // 1. User is not logged in, OR
  // 2. User is logged in but doesn't have an active subscription
  const shouldShowPricing = variant === "default" && !isPending && (!session?.user || hasActiveSubscription === false);

  if (variant === "auth") {
    return (
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <BackButton />
          <div />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-6">
          {shouldShowPricing ? (
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          ) : null}
          <Suspense
            fallback={
              <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
            }
          >
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
