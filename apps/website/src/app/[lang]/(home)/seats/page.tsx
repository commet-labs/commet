import { AnimatedGrid } from "@/components/landing/animated-grid";
import { AnimatedSection } from "@/components/landing/animated-section";
import { BottomCTASection } from "@/components/landing/bottom-cta-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { ThemeImage } from "@/components/landing/theme-image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seats Billing | Commet Billing",
  description:
    "Automated per-seat billing that scales with your customers' teams. Role-based pricing, mid-cycle proration, and minimum commitments—all handled automatically.",
};

const FEATURES = [
  {
    title: "Role-Based Seat Types",
    description:
      "Define seat types with unique pricing per role. Admin ($50), Editor ($25), Viewer (free). Automatic pricing enforcement per role.",
  },
  {
    title: "Automatic Seat Tracking",
    description:
      "Real-time seat balance updates with complete audit trail. Track seat additions, removals, and changes. Automatic balance recalculation with full historical data.",
  },
  {
    title: "Mid-Cycle Proration",
    description:
      "Fair pricing for seat changes during billing periods. Daily, weekly, or hourly proration options. Automatic calculation: (days remaining / total days) × seat price × new seats.",
  },
  {
    title: "Minimum Commitments",
    description:
      "Guarantee billing with minimum seat thresholds. Automatic overage capture for seats beyond commitments. Configure enterprise contracts.",
  },
  {
    title: "Predictable Revenue",
    description:
      "Monthly recurring revenue scales with team growth. Choose advance or arrears billing models. Enable accurate revenue forecasting and financial planning.",
  },
  {
    title: "Complete Audit Trail",
    description:
      "Every seat change tracked with timestamps. Full transparency from seat events to invoice lines. Compliance-ready with detailed seat history.",
  },
];

const PRICING_MODELS = [
  {
    title: "Linear Pricing",
    subtitle: "Flat Rate",
    example: "20 seats × $50 = $1,000",
    description:
      "Same price per seat regardless of quantity. Simple and transparent. Perfect for small to medium teams with straightforward pricing.",
  },
  {
    title: "Graduated Tiers",
    subtitle: "Volume Discounts",
    example: "15 × $50 + 35 × $40 + 10 × $30 = $2,450",
    description:
      "Price per seat decreases with quantity. Volume-based pricing captures team expansion and reduces per-seat costs at scale.",
  },
  {
    title: "With Minimums",
    subtitle: "Commitments",
    example: "MAX(50 minimum, 35 actual) = 50 × $50",
    description:
      "Guarantee billing with minimum seat thresholds. Automatic overage capture for seats beyond commitments. Configure enterprise contracts.",
  },
];

const BILLING_TIMING = [
  {
    title: "Advance Billing",
    subtitle: "Charge for seats at the start of billing period",
    howItWorks: "March 1: Invoice 20 seats × $50 = $1,000",
    advantages: "Predictable cash flow, revenue recognized upfront",
    useCases: "Annual contracts, stable enterprise teams",
  },
  {
    title: "Arrears Billing",
    subtitle: "Charge for seats used at the end of billing period",
    howItWorks: "April 1: Invoice for March usage of 20 seats",
    advantages:
      "Charge for actual usage. Adjust for seat changes automatically.",
    useCases: "Startups, teams with changing sizes",
  },
];

const USE_CASES = [
  {
    title: "Design Collaboration Tool",
    subtitle: "Figma-like design platform pricing",
    seats: [
      "Admin Seats: $50/month (full access)",
      "Editor Seats: $25/month (can create and edit)",
      "Viewer Seats: FREE (read-only access)",
    ],
    total: "3 Admin + 15 Editor + 50 Viewer = $525/month",
  },
  {
    title: "CRM Platform",
    subtitle: "HubSpot-like sales team management",
    seats: [
      "Sales Admin: $100/month (full CRM access)",
      "Sales Rep: $50/month (pipeline management)",
      "Reporting User: $25/month (read-only)",
    ],
    total: "2 Admin + 10 Rep + 5 Reporting = $425/month",
  },
  {
    title: "Development Platform",
    subtitle: "GitHub-like development collaboration",
    seats: [
      "Team Admin: $25/month (management)",
      "Developer: $15/month (code access)",
      "Read-only: $5/month (code viewing)",
    ],
    total: "Minimum 50 Developer seats = $750/month",
  },
  {
    title: "Education Platform",
    subtitle: "Notion-like collaborative workspace",
    seats: [
      "Professor: $30/month (course creation)",
      "Student: $10/month (collaboration)",
      "Admin: $50/month (department management)",
    ],
    total: "Seasonal: Fall = 12 Prof + 300 Students = $3,560/month",
  },
];

const BOTTOM_CTA_BUTTONS = [
  { label: "Get Started for free →", href: "/login" },
  { label: "Documentation →", href: "/docs" },
  { label: "GitHub →", href: "https://github.com/commet-labs" },
];

export default function SeatsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-380 mx-auto px-8 py-32 relative">
        {/* Hero */}
        <AnimatedSection animation="fade-up">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-stretch">
            <div className="space-y-12">
              <h1 className="text-5xl font-normal leading-tight tracking-wide max-w-[600px]">
                Align pricing with team growth.
              </h1>

              <p className="text-base text-fd-muted-foreground max-w-3xl leading-relaxed font-light">
                Automated per-seat billing scales with your customers&apos;
                teams. Define role-based pricing (admin, editor, viewer).
                Configure minimum commitments and automatic mid-cycle proration.
                The billing engine handles everything—seat changes, overages,
                and compliance.
              </p>

              {/* Go to Documentation */}
              <Link
                href="/docs/platform/features/products/seat-based-pricing"
                className="flex flex-row items-center gap-2 p-4 w-fit border border-fd-border hover:bg-fd-accent transition-all duration-300 hover:scale-105 text-sm font-medium rounded-md"
              >
                Learn about Seat-Based Pricing <ArrowRight />
              </Link>
            </div>

            {/* Demo Image */}
            <div className="flex flex-col h-full">
              <div className="overflow-hidden">
                <ThemeImage
                  srcLight="/seats-balance-light.png"
                  srcDark="/seats-balance-dark.png"
                  alt="Seat Management Demo"
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
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </AnimatedGrid>

        {/* Seat Pricing Models */}
        <AnimatedSection animation="fade-up">
          <section className="space-y-8 mb-40">
            <h2 className="text-lg font-medium">Seat Pricing Models</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_MODELS.map((model) => (
                <div
                  key={model.title}
                  className="border border-fd-border p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">{model.title}</h3>
                    <span className="text-xs text-fd-muted-foreground">
                      {model.subtitle}
                    </span>
                  </div>
                  <div className="border border-fd-border p-4 text-xs text-fd-muted-foreground font-mono">
                    {model.example}
                  </div>
                  <p className="text-sm text-fd-muted-foreground font-light">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Billing Timing */}
        <AnimatedSection animation="scale">
          <section className="space-y-8 mb-40">
            <h2 className="text-lg font-medium">Billing Timing Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BILLING_TIMING.map((timing) => (
                <div
                  key={timing.title}
                  className="border border-fd-border p-6 space-y-4"
                >
                  <h3 className="text-base font-medium">{timing.title}</h3>
                  <p className="text-sm text-fd-muted-foreground mb-4">
                    {timing.subtitle}
                  </p>
                  <div className="space-y-3 text-sm text-fd-muted-foreground font-light">
                    <div>
                      <span className="font-medium">How it works:</span>{" "}
                      {timing.howItWorks}
                    </div>
                    <div>
                      <span className="font-medium">Advantages:</span>{" "}
                      {timing.advantages}
                    </div>
                    <div>
                      <span className="font-medium">Use cases:</span>{" "}
                      {timing.useCases}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Use Cases */}
        <AnimatedSection animation="fade-up" delay={100}>
          <section className="space-y-8 mb-40">
            <h2 className="text-lg font-medium">Real-World Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {USE_CASES.map((useCase) => (
                <div
                  key={useCase.title}
                  className="border border-fd-border p-6"
                >
                  <h3 className="text-base font-medium mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-fd-muted-foreground mb-4">
                    {useCase.subtitle}
                  </p>
                  <div className="space-y-2 text-sm text-fd-muted-foreground font-light">
                    {useCase.seats.map((seat) => (
                      <div key={seat}>• {seat}</div>
                    ))}
                    <div className="pt-2 font-medium">{useCase.total}</div>
                  </div>
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
