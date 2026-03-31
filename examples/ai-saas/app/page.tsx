import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-8">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">AI SaaS</h1>
        <p className="text-muted-foreground">
          AI-powered assistant with usage-based billing. Built with Commet,
          Better Auth, and AI SDK.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Get started</Link>
        </Button>
      </div>
    </div>
  );
}
