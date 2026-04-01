import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
        Go home
      </Button>
    </div>
  );
}
