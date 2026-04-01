import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Balance Fixed Pricing",
  description:
    "Prepaid balance with fixed unit prices. Pay for what you use with real dollar transparency.",
});
