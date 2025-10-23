import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";
import { source } from "./source";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <svg
            width="24"
            height="24"
            viewBox="0 0 500 500"
            className="shrink-0"
          >
            <rect
              width="500"
              height="500"
              className="fill-white dark:fill-black"
            />
            <path
              d="M0 0H500V500H0V0Z"
              className="fill-white dark:fill-black"
            />
            <path
              d="M250 71L356.521 255.5H143.479L250 71Z"
              className="fill-black dark:fill-white"
            />
            <path
              d="M250 440L356.521 255.5H143.479L250 440Z"
              className="fill-black dark:fill-white"
            />
            <rect
              width="253.649"
              height="17.0192"
              transform="matrix(0.718749 0.695269 -0.64697 0.762515 143.458 243.867)"
              className="fill-white dark:fill-black"
            />
          </svg>
          Commet
        </>
      ),
    },
    githubUrl: "https://github.com/commet-labs/docs",
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
