import { PricingMarkdown } from "@commet/next";
import { env } from "@/lib/env";

export const GET = PricingMarkdown({
  apiKey: env.COMMET_API_KEY,
  title: "AI SaaS Pricing",
  description:
    "Balance-based plans for AI products. Pay for what you use, with your balance recharged every billing cycle.",
});
