import { SubscribeButton } from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const existing = await commet.subscriptions.get(session.user.id);

  if (existing.data) {
    if (
      existing.data.status === "active" ||
      existing.data.status === "trialing"
    ) {
      redirect("/dashboard");
    }

    if (existing.data.status === "pending_payment") {
      redirect(`/checkout/pending?subscriptionId=${existing.data.id}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl mb-2">Plan Pro</CardTitle>
            <p className="text-muted-foreground">
              Cierra tu compra y vuelve al dashboard.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              Este ejemplo usa un único plan hardcodeado <strong>pro</strong>.
              Al hacer checkout te redirigiremos automáticamente a tu panel.
            </p>

            <SubscribeButton />

            <div className="text-center">
              <Button variant="link" asChild>
                <Link href="/">← Volver</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
