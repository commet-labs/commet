import { Commet } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";

export interface CustomerPortalConfig {
  apiKey: string;
  getCustomerId: (req: NextRequest) => Promise<string | null>;
  returnUrl?:
    | string
    | ((req: NextRequest) => string | null | Promise<string | null>);
  onError?: (error: Error) => void;
}

async function resolveReturnUrl(
  returnUrl: CustomerPortalConfig["returnUrl"],
  req: NextRequest,
): Promise<string | null> {
  if (!returnUrl) {
    return null;
  }

  const rawReturnUrl =
    typeof returnUrl === "function" ? await returnUrl(req) : returnUrl;
  if (!rawReturnUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(rawReturnUrl, req.nextUrl.origin);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
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
  getCustomerId,
  returnUrl,
  onError,
}: CustomerPortalConfig) => {
  const commet = new Commet({
    apiKey,
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
      const resolvedReturnUrl = await resolveReturnUrl(returnUrl, req);
      const result = await commet.portal.getUrl({
        customerId,
        ...(resolvedReturnUrl ? { returnUrl: resolvedReturnUrl } : {}),
      });

      if (!result.success || !result.data) {
        throw new Error(
          result.error?.message || "Failed to create portal session",
        );
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
