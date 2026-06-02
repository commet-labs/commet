import { SDK_VERSION } from "../version";

interface RequestMetrics {
  requestId: string;
  durationMs: number;
}

type ExecutionContext = "test" | "ci";

interface ClientInfo {
  sdk: string;
  sdk_version: string;
  lang: string;
  lang_version: string;
  platform: string;
  arch: string;
  runtime: string;
  runtime_version: string;
  integrations: string[];
  execution_context?: ExecutionContext;
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

function detectExecutionContext(): ExecutionContext | undefined {
  const g = globalThis as Record<string, unknown>;
  if (g.__vitest_worker__ !== undefined || g.jest !== undefined) {
    return "test";
  }
  if (typeof process === "undefined" || !process.env) return undefined;
  const env = process.env;
  if (
    env.VITEST ||
    env.JEST_WORKER_ID ||
    env.BUN_TEST ||
    env.NODE_ENV === "test" ||
    env.npm_lifecycle_event === "test"
  ) {
    return "test";
  }
  if (env.CI || env.GITHUB_ACTIONS || env.GITLAB_CI || env.CIRCLECI) {
    return "ci";
  }
  return undefined;
}

let cachedClientInfo: string | null = null;
let cachedUserAgent: string | null = null;

function collectClientInfo(): ClientInfo {
  const runtime = detectRuntime();
  const executionContext = detectExecutionContext();
  const info: ClientInfo = {
    sdk: "commet-node",
    sdk_version: SDK_VERSION,
    lang: "node",
    lang_version: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    runtime: runtime.name,
    runtime_version: runtime.version,
    integrations: [...registeredIntegrations],
  };
  if (executionContext) {
    info.execution_context = executionContext;
  }
  return info;
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
