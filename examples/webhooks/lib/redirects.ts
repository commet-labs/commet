const allowedRedirectPaths = new Set(["/dashboard", "/pricing", "/checkout"]);

export function safeRedirectPath(value: string | null): string {
  if (!value) {
    return "/dashboard";
  }

  const pathname = value.trim();
  if (!allowedRedirectPaths.has(pathname)) {
    return "/dashboard";
  }

  return pathname;
}

export function buildInternalHref(
  pathname: string,
  params: Record<string, string | null | undefined>,
) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
