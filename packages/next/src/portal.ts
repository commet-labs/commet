import { Commet } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";

export interface CustomerPortalConfig {
  apiKey: string;
  getCustomerId: (req: NextRequest) => Promise<string | null>;
  environment?: "sandbox" | "production";
  onError?: (error: Error) => void;
}

/**
 * Creates Next.js route handler for Customer Portal access
 *
 * @example
 * ```typescript
 * // app/api/commet/portal/route.ts
 * import { CustomerPortal } from "@commet/next";
 * import { auth } from "@/lib/auth";
 *
 * export const GET = CustomerPortal({
 *   apiKey: process.env.COMMET_API_KEY!,
 *   getCustomerId: async (req) => {
 *     const session = await auth.api.getSession({ headers: req.headers });
 *     return session?.user.id ?? null;
 *   },
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Use in component
 * export function BillingButton() {
 *   return (
 *     <Button asChild>
 *       <Link href="/api/commet/portal">Manage Billing</Link>
 *     </Button>
 *   );
 * }
 * ```
 */
export const CustomerPortal = ({
  apiKey,
  environment = "production",
  getCustomerId,
  onError,
}: CustomerPortalConfig) => {
  const commet = new Commet({
    apiKey,
    environment,
  });

  return async (req: NextRequest) => {
    try {
      // Get customer identifier from request
      const customerId = await getCustomerId(req);

      if (!customerId) {
        return NextResponse.json(
          { error: "Customer not authenticated" },
          { status: 401 },
        );
      }

      // Get portal URL from Commet
      const result = await commet.portal.getUrl({
        externalId: customerId,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to create portal session");
      }

      // Redirect to customer portal
      return NextResponse.redirect(result.data.portalUrl);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      // Call custom error handler if provided
      onError?.(errorObj);

      // Log error
      console.error("[Commet Portal]", errorObj);

      // Return error response
      return NextResponse.json(
        { error: "Failed to access customer portal" },
        { status: 500 },
      );
    }
  };
};
