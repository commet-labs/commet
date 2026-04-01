import { PricingMarkdown } from "@commet/next";

export const GET = PricingMarkdown({
  apiKey: process.env.COMMET_API_KEY!,
  title: "Seats SaaS Pricing",
  description:
    "Simple, seat-based pricing. Choose the plan that works for your team. Pay per seat, only for what you use.",
});
