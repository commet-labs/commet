import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Webhooks SaaS Pricing",
  description:
    "Simple subscription pricing. Choose the plan that works for you. No hidden fees, no surprises.",
});
