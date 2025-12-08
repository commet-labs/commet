import { AnimatedGrid } from "@/components/landing/animated-grid";
import { AnimatedSection } from "@/components/landing/animated-section";
import { BottomCTASection } from "@/components/landing/bottom-cta-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { ThemeImage } from "@/components/landing/theme-image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payments | Commet Billing",
  description:
    "Automated global payment processing for B2B companies. Receive payouts in your local currency, manage multiple payment methods, and comply with tax regulations.",
};

const BENEFITS = [
  {
    title: "Sell Seamlessly Worldwide",
    description:
      "One connection, global payments. Stop wasting time on infrastructure that distracts you from your business.",
  },
  {
    title: "We Handle Taxes for You",
    description:
      "No more headaches about registering in other jurisdictions or managing sales taxes. You stay compliant without even noticing.",
  },
  {
    title: "Global Payouts",
    description:
      "Receive payouts in your local accounts. Manage withdrawals however you want.",
  },
];

const BOTTOM_CTA_BUTTONS = [
  { label: "Get Started for free →", href: "/login" },
  { label: "Documentation →", href: "/docs" },
  { label: "GitHub →", href: "https://github.com/commet-labs" },
];

export default function PaymentsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-380 mx-auto px-8 py-32 relative">
        {/* Hero */}
        <AnimatedSection animation="fade-up">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-stretch">
            <div className="space-y-12">
              <h1 className="text-5xl font-normal leading-tight tracking-wide max-w-[600px]">
                Collect payments globally with Commet as Merchant of Record
              </h1>

              <p className="text-base text-fd-muted-foreground max-w-3xl leading-relaxed font-light">
                Start collecting globally from day one while we handle your tax
                compliance—so you can stay focused on your business. Receive
                payouts in your local account whenever you want, hassle-free.
              </p>

              {/* Go to Documentation */}
              <Link
                href="/docs/platform/features/payouts/finance-overview"
                className="flex flex-row items-center gap-2 p-4 w-fit border border-fd-border hover:bg-fd-accent transition-all duration-300 hover:scale-105 text-sm font-medium rounded-md"
              >
                Learn about Payments & Payouts <ArrowRight />
              </Link>
            </div>

            <div className="flex flex-col h-full">
              <div className="transform transition-transform duration-300 rounded-lg overflow-hidden">
                <ThemeImage
                  srcLight="/dashboard-light.png"
                  srcDark="/dashboard-dark.png"
                  alt="Payments and Payouts Demo"
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

        {/* Key Benefits */}
        <AnimatedGrid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40"
          staggerDelay={80}
        >
          {BENEFITS.map((benefit) => (
            <FeatureCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </AnimatedGrid>

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
