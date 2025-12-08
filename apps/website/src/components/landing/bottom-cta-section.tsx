import { CTAButton } from "./cta-button";

export interface BottomCTASectionProps {
  title: string;
  description: string;
  buttons: Array<{
    label: string;
    href: string;
  }>;
}

export function BottomCTASection({
  title,
  description,
  buttons,
}: BottomCTASectionProps) {
  return (
    <section
      className="text-center space-y-6"
      aria-label="Call to action section"
    >
      <div className="space-y-4 max-w-2xl mx-auto">
        <h2 className="text-lg mx-auto font-medium">{title}</h2>
        <p className="text-xs text-fd-muted-foreground text-center font-light">
          {description}
        </p>
        {/* Navigation Links */}
        <nav
          className="flex flex-wrap gap-4 justify-center"
          aria-label="CTA actions"
        >
          {buttons.map((button) => (
            <CTAButton
              key={button.href}
              href={button.href}
              label={button.label}
              variant="secondary"
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
