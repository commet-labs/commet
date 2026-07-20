import { SDK_VERSION } from "../version";

const NPM_DIST_TAGS_URL =
  "https://registry.npmjs.org/-/package/%40commet%2Fnode/dist-tags";
const UPDATE_CHECK_TIMEOUT_MS = 3000;
const UPDATE_CHECK_STATE_KEY = Symbol.for("@commet/node.update-check");

type VersionNumbers = readonly [number, number, number];

interface ParsedVersion {
  numbers: VersionNumbers;
  prereleaseIdentifiers: string[];
}

function parseVersion(version: string): ParsedVersion | null {
  const match =
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.exec(
      version,
    );
  if (!match) return null;

  const numbers: VersionNumbers = [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
  ];
  if (!numbers.every(Number.isSafeInteger)) return null;

  return {
    numbers,
    prereleaseIdentifiers: match[4] ? match[4].split(".") : [],
  };
}

function compareNumericIdentifier(latest: string, installed: string): number {
  const normalizedLatest = latest.replace(/^0+(?=\d)/, "");
  const normalizedInstalled = installed.replace(/^0+(?=\d)/, "");
  if (normalizedLatest.length > normalizedInstalled.length) return 1;
  if (normalizedLatest.length < normalizedInstalled.length) return -1;
  if (normalizedLatest > normalizedInstalled) return 1;
  if (normalizedLatest < normalizedInstalled) return -1;
  return 0;
}

function comparePrereleaseIdentifier(
  latest: string,
  installed: string,
): number {
  const latestIsNumber = /^\d+$/.test(latest);
  const installedIsNumber = /^\d+$/.test(installed);

  if (latestIsNumber && installedIsNumber) {
    return compareNumericIdentifier(latest, installed);
  }
  if (latestIsNumber) return -1;
  if (installedIsNumber) return 1;
  if (latest > installed) return 1;
  if (latest < installed) return -1;
  return 0;
}

function comparePrereleaseVersions(
  latest: string[],
  installed: string[],
): number {
  if (latest.length === 0) return installed.length === 0 ? 0 : 1;
  if (installed.length === 0) return -1;

  const identifierCount = Math.max(latest.length, installed.length);
  for (let index = 0; index < identifierCount; index++) {
    const latestIdentifier = latest[index];
    const installedIdentifier = installed[index];
    if (latestIdentifier === undefined) return -1;
    if (installedIdentifier === undefined) return 1;

    const comparison = comparePrereleaseIdentifier(
      latestIdentifier,
      installedIdentifier,
    );
    if (comparison !== 0) return comparison;
  }

  return 0;
}

export function isNewerVersion(latest: string, installed: string): boolean {
  const latestVersion = parseVersion(latest);
  const installedVersion = parseVersion(installed);
  if (!latestVersion || !installedVersion) return false;

  for (let index = 0; index < latestVersion.numbers.length; index++) {
    if (latestVersion.numbers[index] > installedVersion.numbers[index]) {
      return true;
    }
    if (latestVersion.numbers[index] < installedVersion.numbers[index]) {
      return false;
    }
  }

  return (
    comparePrereleaseVersions(
      latestVersion.prereleaseIdentifiers,
      installedVersion.prereleaseIdentifiers,
    ) > 0
  );
}

function claimSdkUpdateCheck(): boolean {
  if (Reflect.get(globalThis, UPDATE_CHECK_STATE_KEY) === true) return false;
  Reflect.set(globalThis, UPDATE_CHECK_STATE_KEY, true);
  return true;
}

export function shouldCheckForSdkUpdates(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.CI) return false;
  return process.env.COMMET_NO_UPDATE_CHECK !== "1";
}

export async function checkForSdkUpdate(
  installedVersion: string,
): Promise<void> {
  try {
    const response = await fetch(NPM_DIST_TAGS_URL, {
      signal: AbortSignal.timeout(UPDATE_CHECK_TIMEOUT_MS),
    });
    if (!response.ok) return;

    const distTags: unknown = await response.json();
    if (
      typeof distTags !== "object" ||
      distTags === null ||
      !("latest" in distTags) ||
      typeof distTags.latest !== "string" ||
      !isNewerVersion(distTags.latest, installedVersion)
    ) {
      return;
    }

    console.warn(
      `[Commet] @commet/node ${installedVersion} is out of date. The latest version is ${distTags.latest}.\nUpdate with: npm install @commet/node@latest`,
    );
  } catch {}
}

export function scheduleSdkUpdateCheck(): void {
  if (!shouldCheckForSdkUpdates() || !claimSdkUpdateCheck()) return;

  const scheduledCheck = setImmediate(() => {
    void checkForSdkUpdate(SDK_VERSION);
  });
  scheduledCheck.unref();
}
