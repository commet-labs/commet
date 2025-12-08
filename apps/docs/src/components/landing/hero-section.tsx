"use client";

import { ThemeImage } from "@/components/landing/theme-image";
import { useEffect, useState } from "react";
import { CTAButton } from "./cta-button";

export interface HeroSectionProps {
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageSrcLight: string;
  imageSrcDark: string;
  imageAlt: string;
}

export function HeroSection({
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  imageSrcLight,
  imageSrcDark,
  imageAlt,
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40 items-stretch"
      aria-label="Hero section"
    >
      {/* Content */}
      <div className="space-y-12">
        <h1
          className={`text-5xl font-normal leading-tight tracking-wide max-w-[600px] transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-base text-fd-muted-foreground max-w-3xl leading-relaxed font-light transition-all duration-1000 ease-out delay-150 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {description}
        </p>
        {/* Call to Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 max-w-sm transition-all duration-1000 ease-out delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <CTAButton
            href={primaryCtaHref}
            label={primaryCtaLabel}
            variant="primary"
          />
        </div>
      </div>

      {/* Image with parallax effect */}
      <div className="flex flex-col h-full">
        <div
          className={`flex-1 h-full transition-all duration-1200 ease-out delay-200 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ThemeImage
              srcLight={imageSrcLight}
              srcDark={imageSrcDark}
              alt={imageAlt}
              width={1080}
              height={578}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
