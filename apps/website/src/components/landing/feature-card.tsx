"use client";

export interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="border border-fd-border p-6 space-y-4 cursor-default hover:bg-fd-accent/50 h-40">
      <h2 className="text-base font-medium mb-3">{title}</h2>
      <p className="text-xs text-fd-muted-foreground font-light leading-relaxed">
        {description}
      </p>
    </article>
  );
}
