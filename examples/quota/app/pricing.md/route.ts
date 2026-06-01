import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Tasks SaaS Pricing",
  description:
    "Simple, quota-based pricing. Choose the plan that fits your team. Pay for extra tasks only when you go over.",
});
