import { CustomerPortal } from "@commet/next";
import { auth } from "@/lib/auth/auth";
import { env } from "@/lib/env";

export const GET = CustomerPortal({
  apiKey: env.COMMET_API_KEY,
  environment: env.COMMET_ENVIRONMENT,
  getCustomerId: async (req) => {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user.id ?? null;
  },
});
