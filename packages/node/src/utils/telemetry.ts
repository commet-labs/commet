import { SDK_VERSION } from "../version";

interface RequestMetrics {
  requestId: string;
  durationMs: number;
}

interface ClientInfo {
  sdk: string;
  sdkVersion: string;
  lang: string;
  langVersion: string;
  platform: string;
  arch: string;
  runtime: string;
  runtimeVersion: string;
  integrations: string[];
}

const registeredIntegrations: Set<string> = new Set();

export function registerIntegration(name: string, version: string): void {
  registeredIntegrations.add(`${name}@${version}`);
  cachedClientInfo = null;
}

function detectRuntime(): { name: string; version: string } {
  const g = globalThis as Record<string, unknown>;
  const bun = g.Bun as { version: string } | undefined;
  if (bun) return { name: "bun", version: bun.version };
  const deno = g.Deno as { version: { deno: string } } | undefined;
  if (deno) return { name: "deno", version: deno.version.deno };
  return { name: "node", version: process.versions.node };
}

let cachedClientInfo: string | null = null;
let cachedUserAgent: string | null = null;

function collectClientInfo(): ClientInfo {
  const runtime = detectRuntime();
  return {
    sdk: "commet-node",
    sdkVersion: SDK_VERSION,
    lang: "node",
    langVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    runtime: runtime.name,
    runtimeVersion: runtime.version,
    integrations: [...registeredIntegrations],
  };
}

export function getClientInfoHeader(): string {
  if (!cachedClientInfo) {
    cachedClientInfo = JSON.stringify(collectClientInfo());
  }
  return cachedClientInfo;
}

export function getUserAgent(): string {
  if (!cachedUserAgent) {
    const runtime = detectRuntime();
    cachedUserAgent = `commet-node/${SDK_VERSION} ${runtime.name}/${runtime.version} ${process.platform}/${process.arch}`;
  }
  return cachedUserAgent;
}

export function formatRequestMetrics(metrics: RequestMetrics): string {
  return JSON.stringify({
    last_request_metrics: {
      request_id: metrics.requestId,
      duration_ms: metrics.durationMs,
    },
  });
}
