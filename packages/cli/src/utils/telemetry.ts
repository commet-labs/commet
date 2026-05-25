import { loadProjectConfig } from "./config";

declare const __CLI_VERSION__: string;

const CLI_VERSION: string =
  typeof __CLI_VERSION__ !== "undefined" ? __CLI_VERSION__ : "0.0.0";

const TELEMETRY_URL = "https://commet.co/api/cli/telemetry";

function detectRuntime(): { name: string; version: string } {
  if ("Bun" in globalThis) {
    const bun = (globalThis as Record<string, unknown>).Bun as {
      version: string;
    };
    if (bun && typeof bun.version === "string")
      return { name: "bun", version: bun.version };
  }
  if ("Deno" in globalThis) {
    const deno = (globalThis as Record<string, unknown>).Deno as {
      version: { deno: string };
    };
    if (deno?.version?.deno)
      return { name: "deno", version: deno.version.deno };
  }
  return { name: "node", version: process.versions.node };
}

let cachedClientInfo: string | null = null;
let cachedUserAgent: string | null = null;

function collectClientInfo() {
  const runtime = detectRuntime();
  return {
    sdk: "commet-cli",
    sdkVersion: CLI_VERSION,
    lang: "node",
    langVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    runtime: runtime.name,
    runtimeVersion: runtime.version,
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
    cachedUserAgent = `commet-cli/${CLI_VERSION} ${runtime.name}/${runtime.version} ${process.platform}/${process.arch}`;
  }
  return cachedUserAgent;
}

function isTelemetryDisabled(): boolean {
  return (
    process.env.COMMET_TELEMETRY_DISABLED === "1" ||
    process.env.DO_NOT_TRACK === "1"
  );
}

function resolveOrgId(): string | null {
  if (process.env.COMMET_API_KEY) return null;
  try {
    const config = loadProjectConfig();
    return config?.orgId ?? null;
  } catch {
    return null;
  }
}

let commandStartTime: number | null = null;
let apiRequestMade = false;
let commandReported = false;

export function markCommandStart(): void {
  commandStartTime = Date.now();
  apiRequestMade = false;
  commandReported = false;
}

export function markApiRequest(): void {
  apiRequestMade = true;
}

function sendTelemetry(payload: Record<string, unknown>): void {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 750);

  fetch(TELEMETRY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}

export function reportCommand(
  command: string,
  outcome: "success" | "error",
  errorCode?: string,
): void {
  if (commandReported) return;
  if (isTelemetryDisabled()) return;
  if (apiRequestMade && outcome === "success") return;

  commandReported = true;

  const durationMs = commandStartTime ? Date.now() - commandStartTime : null;
  const runtime = detectRuntime();
  const orgId = resolveOrgId();

  sendTelemetry({
    type: "command",
    command,
    outcome,
    ...(errorCode ? { errorCode } : {}),
    ...(orgId ? { orgId } : {}),
    cliVersion: CLI_VERSION,
    runtime: runtime.name,
    runtimeVersion: runtime.version,
    platform: process.platform,
    arch: process.arch,
    ...(durationMs !== null ? { durationMs } : {}),
    authMode: process.env.COMMET_API_KEY ? "api_key" : "login",
  });
}

export function reportCrash(error: unknown): void {
  if (commandReported) return;
  if (isTelemetryDisabled()) return;

  commandReported = true;

  const command = process.argv[2] || "(default)";
  const orgId = resolveOrgId();
  const errorName =
    error instanceof Error ? error.constructor.name : "UnknownError";

  sendTelemetry({
    type: "crash",
    command,
    errorName,
    ...(orgId ? { orgId } : {}),
    cliVersion: CLI_VERSION,
    platform: process.platform,
    arch: process.arch,
    authMode: process.env.COMMET_API_KEY ? "api_key" : "login",
  });
}

export function installCrashHandler(): void {
  process.on("uncaughtException", (error) => {
    reportCrash(error);
    console.error("Fatal:", error.message);
    setTimeout(() => process.exit(1), 800);
  });

  process.on("unhandledRejection", (reason) => {
    reportCrash(reason);
    console.error(
      "Fatal:",
      reason instanceof Error ? reason.message : String(reason),
    );
    setTimeout(() => process.exit(1), 800);
  });
}
