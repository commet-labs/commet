import { AnimatedGrid } from "@/components/landing/animated-grid";
import { AnimatedSection } from "@/components/landing/animated-section";
import { BottomCTASection } from "@/components/landing/bottom-cta-section";
import { ThemeImage } from "@/components/landing/theme-image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Usage Metrics | Commet Billing",
  description:
    "Real-time usage event ingestion with idempotency guarantees. Track API calls, transactions, and consumption metrics with automatic aggregation and flexible late event policies.",
};

const FEATURES = [
  {
    title: "Event Ingestion",
    description:
      "Real-time event ingestion with automatic idempotency. Track API calls, transactions, compute hours, and any consumption metric with customerEventId deduplication.",
  },
  {
    title: "Metric Aggregation",
    description:
      "Configure COUNT, SUM, and UNIQUE aggregations with custom filters. Automatic period-based calculations with customer timezone awareness.",
  },
  {
    title: "Late Event Handling",
    description:
      "Configurable policies for events arriving after billing cutoff. Choose next period, current period, or ignore based on your business needs.",
  },
  {
    title: "Usage-Based Pricing",
    description:
      "Support per-unit, tiered (volume/graduated), and package-based pricing models. Automatic overage calculation with included units and minimums.",
  },
  {
    title: "Complete Audit Trail",
    description:
      "Every invoice line traceable to source events with timestamps. Full transparency from event ingestion to invoice generation for compliance.",
  },
  {
    title: "SDK Integration",
    description:
      "Simple TypeScript SDK for event tracking. One-line integration with automatic retries, batching, and error handling built-in.",
  },
];

const METRIC_TYPES = [
  {
    title: "COUNT",
    subtitle: "Event Count",
    example: "api_calls: 45,230",
    description:
      "Count total number of events. Perfect for API calls, requests, or any countable action.",
  },
  {
    title: "SUM",
    subtitle: "Aggregated Value",
    example: "compute_hours: 1,240.5",
    description:
      "Sum numeric values from events. Ideal for compute hours, storage GB, or transaction amounts.",
  },
  {
    title: "UNIQUE",
    subtitle: "Distinct Count",
    example: "active_users: 3,450",
    description:
      "Count unique values. Perfect for MAU, unique API consumers, or distinct resources accessed.",
  },
];

const USE_CASES = [
  {
    title: "API Platform Billing",
    subtitle:
      "Track API requests, successful calls, and error rates per customer",
    description:
      "Bill customers accurately based on API consumption with tiered pricing. Track requests by endpoint, method, and response status for complete transparency.",
  },
  {
    title: "Cloud Infrastructure",
    subtitle: "Monitor compute hours, storage usage, and bandwidth consumption",
    description:
      "Aggregate resource usage across multiple services and regions. Support complex pricing with minimums, included units, and overage charges.",
  },
  {
    title: "Payment Processing",
    subtitle: "Count transactions and sum payment volumes with percentage fees",
    description:
      "Track transaction counts and volumes separately. Apply per-transaction fees plus percentage-based charges with configurable minimums and maximums.",
  },
  {
    title: "SaaS Analytics",
    subtitle: "Measure MAU, feature usage, and data processing volumes",
    description:
      "Use UNIQUE aggregation for monthly active users, COUNT for feature usage, and SUM for data processing. Complete flexibility for any SaaS metric.",
  },
];

const BOTTOM_CTA_BUTTONS = [
  { label: "Get Started for free →", href: "/login" },
  { label: "Documentation →", href: "/docs" },
  { label: "GitHub →", href: "https://github.com/commet-labs" },
];

export default function UsageMetricsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-380 mx-auto px-8 py-32 relative">
        {/* Hero */}
        <AnimatedSection animation="fade-up">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-stretch">
            <div className="space-y-12">
              <h1 className="text-5xl font-normal leading-tight tracking-wide max-w-[600px]">
                Track usage events with precision and flexibility.
              </h1>

              <p className="text-base text-fd-muted-foreground max-w-3xl leading-relaxed font-light">
                Real-time event ingestion with idempotency guarantees. Track API
                calls, transactions, compute usage, and any consumption metric.
                Automatic aggregation with configurable late event policies and
                complete audit trails for accurate billing.
              </p>

              {/* Go to Documentation */}
              <Link
                href="/docs/platform/features/products/usage-based-pricing"
                className="flex flex-row items-center gap-2 p-4 w-fit border border-fd-border hover:bg-fd-accent transition-all duration-300 hover:scale-105 text-sm font-medium rounded-md"
              >
                Learn about Usage-Based Pricing <ArrowRight />
              </Link>
            </div>

            {/* Demo Image */}
            <div className="flex flex-col h-full">
              <div className="overflow-hidden">
                <ThemeImage
                  srcLight="/usage-metric-light.png"
                  srcDark="/usage-metric-dark.png"
                  alt="Usage Metrics Demo"
                  width={1080}
                  height={600}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  priority
                />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Divider */}
        <AnimatedSection animation="fade-in" delay={200}>
          <div className="border-t border-fd-border h-[45px] w-full mb-20" />
        </AnimatedSection>

        {/* Features Grid */}
        <AnimatedGrid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40"
          staggerDelay={80}
        >
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="border border-fd-border p-6 space-y-4 cursor-default hover:bg-fd-accent/50 h-40"
            >
              <h2 className="text-base font-medium mb-3">{feature.title}</h2>
              <p className="text-xs text-fd-muted-foreground font-light leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </AnimatedGrid>

        {/* Metric Types */}
        <AnimatedSection animation="fade-up">
          <section className="space-y-8 mb-40">
            <h2 className="text-lg font-medium">Metric Aggregation Types</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {METRIC_TYPES.map((metric) => (
                <div
                  key={metric.title}
                  className="border border-fd-border p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">{metric.title}</h3>
                    <span className="text-xs text-fd-muted-foreground">
                      {metric.subtitle}
                    </span>
                  </div>
                  <div className="border border-fd-border p-4 text-xs text-fd-muted-foreground font-mono">
                    {metric.example}
                  </div>
                  <p className="text-xs text-fd-muted-foreground font-light">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Use Cases */}
        <AnimatedSection animation="scale">
          <section className="space-y-8 mb-40">
            <h2 className="text-lg font-medium">Use Cases</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {USE_CASES.map((useCase) => (
                <div
                  key={useCase.title}
                  className="border border-fd-border p-6"
                >
                  <h3 className="text-base font-medium mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-xs text-fd-muted-foreground mb-4">
                    {useCase.subtitle}
                  </p>
                  <p className="text-xs text-fd-muted-foreground font-light leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Divider */}
        <AnimatedSection animation="fade-in">
          <div className="border-t border-fd-border h-[45px] w-full mb-20" />
        </AnimatedSection>

        {/* Bottom CTA Section */}
        <AnimatedSection animation="fade-up">
          <BottomCTASection
            title="Start Building"
            description="Get started with Commet Billing and automate your complex billing operations."
            buttons={BOTTOM_CTA_BUTTONS}
          />
        </AnimatedSection>
      </div>
    </main>
  );
}
