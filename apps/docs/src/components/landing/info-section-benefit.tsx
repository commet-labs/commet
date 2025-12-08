"use client";

import { CTAButton } from "./cta-button";

interface InfoSectionBenefitProps {
  sections: Array<{
    title: string;
    description?: string;
    pricing?: string;
    cta?: string;
  }>;
}

export function InfoSectionBenefit({ sections }: InfoSectionBenefitProps) {
  return (
    <section className="flex flex-col gap-20 mb-40 items-center">
      {sections.map((section) => (
        <div key={section.title} className="text-center max-w-3xl">
          <h2 className="text-4xl font-normal leading-tight tracking-wide mb-8">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-base text-fd-muted-foreground leading-relaxed font-light mb-4">
              {section.description}
            </p>
          )}
          {section.pricing && (
            <p className="text-base text-fd-muted-foreground leading-relaxed font-light mb-6">
              {section.pricing}
            </p>
          )}
          {section.cta && (
            <CTAButton
              href="/pricing"
              label={section.cta}
              variant="secondary"
            />
          )}
        </div>
      ))}
    </section>
  );
}
