export interface CTAButtonProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

export function CTAButton({
  href,
  label,
  variant = "primary",
}: CTAButtonProps) {
  const isPrimary = variant === "primary";

  const baseStyles =
    "px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 text-center inline-block transform hover:scale-105 active:scale-95";
  const variantStyles = isPrimary
    ? "bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg"
    : "border border-border hover:bg-accent hover:shadow-md";

  return (
    <a href={href} className={`${baseStyles} ${variantStyles}`}>
      {label}
    </a>
  );
}
