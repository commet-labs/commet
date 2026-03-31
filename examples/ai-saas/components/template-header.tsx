import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function CommetLogo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 500 500"
      aria-label="Commet"
    >
      <path d="M0 0H500V500H0V0Z" className="fill-background" />
      <path
        d="M250 71L356.521 255.5H143.479L250 71Z"
        className="fill-foreground"
      />
      <path
        d="M250 440L356.521 255.5H143.479L250 440Z"
        className="fill-foreground"
      />
      <rect
        width="253.649"
        height="17.0192"
        transform="matrix(0.718749 0.695269 -0.64697 0.762515 143.458 243.867)"
        className="fill-background"
      />
    </svg>
  );
}

export function TemplateHeader({ templateName }: { templateName: string }) {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link href="https://commet.co" className="text-foreground hover:text-foreground/80">
          <CommetLogo />
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">{templateName}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="https://commet.co/docs" target="_blank" />}
        >
          Docs
          <ExternalLink className="size-3 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="https://github.com/commet-labs/commet" target="_blank" aria-label="GitHub" />}
        >
          <Github className="size-4" />
        </Button>
      </div>
    </header>
  );
}
