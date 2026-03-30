import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start for free and scale as you grow.",
});
