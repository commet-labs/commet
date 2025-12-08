import type { SidebarTab } from "../components/layout/sidebar/tabs/index";

function normalize(url: string) {
  if (url.length > 1 && url.endsWith("/")) return url.slice(0, -1);
  return url;
}

export function isActive(
  url: string,
  pathname: string,
  nested = true,
): boolean {
  const normalizedUrl = normalize(url);
  const normalizedPathname = normalize(pathname);

  return (
    normalizedUrl === normalizedPathname ||
    (nested && normalizedPathname.startsWith(`${normalizedUrl}/`))
  );
}

export function isTabActive(tab: SidebarTab, pathname: string) {
  if (tab.urls) return tab.urls.has(normalize(pathname));

  return isActive(tab.url, pathname, true);
}
