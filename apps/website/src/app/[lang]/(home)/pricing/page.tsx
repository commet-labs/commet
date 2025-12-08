import { AnimatedSection } from "@/components/landing/animated-section";
import { BottomCTASection } from "@/components/landing/bottom-cta-section";
import { CTAButton } from "@/components/landing/cta-button";
import { PricingCard } from "@/components/landing/pricing-card";
import { AlertCircle, CreditCard, RotateCcw, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Commet Billing",
  description: "Simple and transparent pricing for your billing needs",
};

const PRICING_CARDS = [
  {
    icon: CreditCard,
    title: "Transactions",
    description: "4.5% + USD 0.40 per transaction",
    details: "(We cover Stripe costs of 3.4% + $0.30)",
  },
  {
    icon: AlertCircle,
    title: "No US credit cards",
    description: "+1.5%",
    details: "This is a Stripe-only cost. (We don't add a markup here)",
  },
  {
    icon: Scale,
    title: "Disputes",
    description: "USD 15 per dispute",
    details: "This is a Stripe-only cost. (We don't add a markup here)",
  },
  {
    icon: RotateCcw,
    title: "Refunds",
    description: "Free",
  },
];

const BOTTOM_CTA_BUTTONS = [
  { label: "Get Started for free →", href: "/login" },
  { label: "Documentation →", href: "/docs" },
  { label: "GitHub →", href: "https://github.com/commet-labs" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-380 mx-auto px-8 py-32 relative">
        {/* Hero */}
        <AnimatedSection animation="fade-up">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-stretch">
            <div className="space-y-12">
              <h1 className="text-5xl font-normal leading-tight tracking-wide max-w-[600px]">
                Transparent price to the easy all in one billing tool
              </h1>
              <p className="text-base text-fd-muted-foreground max-w-3xl leading-relaxed font-light">
                We use Stripe as our payment rails, so all fees mentioned
                correspond to Stripe, with our margin added in some cases. We
                believe in transparency and are working to reduce costs for
                everyone.
              </p>
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
                <CTAButton
                  href="/login"
                  label="Get Started for free →"
                  variant="primary"
                />
              </div>
            </div>
            {/* Pricing Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PRICING_CARDS.map((card) => (
                <PricingCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  details={card.details}
                />
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
