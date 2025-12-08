import { AnimatedGrid } from "@/components/landing/animated-grid";
import { AnimatedSection } from "@/components/landing/animated-section";
import { BottomCTASection } from "@/components/landing/bottom-cta-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { HeroSection } from "@/components/landing/hero-section";
import { InfoSectionBenefit } from "@/components/landing/info-section-benefit";

const FEATURES = [
  {
    title: "Flexible Billing Models",
    description:
      "Support any billing model: fixed subscriptions, usage-based, per-seat, tiered pricing, percentage fees, packaged units, credit systems, and minimum commitments. 4-level pricing resolution for complete flexibility.",
  },
  {
    title: "Usage & Seat Tracking",
    description:
      "Real-time event ingestion with idempotency guarantees. Track API calls, transactions, active seats, and any consumption metric. Automatic aggregation with configurable late event policies.",
  },
  {
    title: "Global Payouts",
    description:
      "Receive your payouts in your local account whenever you want, hassle-free. You're in full control of your payouts.",
  },
  {
    title: "Forget Tax Compliance",
    description:
      "As your Merchant of Record, we handle all your sales taxes across every jurisdiction you sell in. Forget the headaches and focus on building your product.",
  },
  {
    title: "Start to collect in minutes",
    description:
      "Start collecting global payments in minutes. Integrate Commet and forget about managing multiple payment providers.",
  },
  {
    title: "Production Ready",
    description:
      "Built for scale with automated billing engine and optimized for 10,000+ customers monthly. Zero disputes through accurate calculation and complete transparency.",
  },
];

const INFO_SECTIONS = [
  {
    title: "How we works?",
    description:
      "We work as your Merchant of Record, offering the simplest API to manage billing and collections. We handle taxes, compliance, refunds, and payouts for you.",
  },
  {
    title: "From builders to builders",
    description:
      "We truly believe the next generation of unicorns will be built by small teams laser-focused on their products. We want to make that vision possible through the simplest and most developer-friendly abstraction in billing and payments.",
  },
  {
    title: "Our Simple, Transparent Pricing",
    pricing: "4.5% + $0.40 per transaction",
    cta: "Learn More",
  },
];

const BOTTOM_CTA_BUTTONS = [
  {
    label: "Get Started for free →",
    href: "/login",
  },
  {
    label: "Documentation →",
    href: "/docs",
  },
  {
    label: "GitHub →",
    href: "https://github.com/commet-labs",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-380 mx-auto px-8 py-32 relative">
        {/* Hero Section */}
        <HeroSection
          title="The billing and payments solution for SaaS and AI products"
          description="Start to bill and monetize your users in just 2 minutes. Accept global payments and setup billing flexibly with usage-based, subscription, all without building your own infrastructure."
          primaryCtaLabel="Get Started for free →"
          primaryCtaHref="/login"
          imageSrcLight="/dashboard-light.png"
          imageSrcDark="/dashboard-dark.png"
          imageAlt="Dashboard Demo"
        />

        {/* Divider */}
        <AnimatedSection animation="fade-in" delay={400}>
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

        {/* Divider */}
        <AnimatedSection animation="fade-in">
          <div className="border-t border-fd-border h-[45px] w-full mb-20" />
        </AnimatedSection>

        {/* Info Sections */}
        <AnimatedSection animation="scale">
          <InfoSectionBenefit sections={INFO_SECTIONS} />
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
