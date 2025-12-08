import Image from "next/image";
import type { ImageProps } from "next/image";

interface ThemeImageProps extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
}

export function ThemeImage({
  srcLight,
  srcDark,
  alt,
  className,
  ...props
}: ThemeImageProps) {
  return (
    <>
      <Image
        src={srcLight}
        alt={alt}
        className={`block dark:hidden w-full h-auto ${className || ""}`}
        fetchPriority="high"
        {...props}
      />

      <Image
        src={srcDark}
        alt={alt}
        className={`hidden dark:block w-full h-auto ${className || ""}`}
        fetchPriority="low"
        {...props}
      />
    </>
  );
}
