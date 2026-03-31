import { CustomerPortal } from "@commet/next";
import { auth } from "@/lib/auth/auth";

export const GET = CustomerPortal({
  apiKey: process.env.COMMET_API_KEY!,
  getCustomerId: async (req) => {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user.id ?? null;
  },
});
