import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Metered Pricing",
  description:
    "Usage-based pricing. Pay for what you use with metered billing and overage charges.",
});
