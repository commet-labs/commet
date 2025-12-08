import type { LucideIcon } from "lucide-react";

interface PricingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string;
}

export function PricingCard({
  icon: Icon,
  title,
  description,
  details,
}: PricingCardProps) {
  return (
    <div className="border border-fd-border p-8 rounded-lg bg-fd-background/50 group cursor-default transition-all duration-300 hover:border-fd-border hover:bg-fd-accent/50">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Icon size={24} />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-base text-center font-normal mb-2">{description}</p>
      {details && (
        <p className="text-sm text-center text-fd-muted-foreground">
          {details}
        </p>
      )}
    </div>
  );
}
