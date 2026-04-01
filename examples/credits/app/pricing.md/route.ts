import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Credits Pricing",
  description:
    "Credit packs for every need. Buy once, use as you go. Top up anytime.",
});
