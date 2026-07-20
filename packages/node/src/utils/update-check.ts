import { SDK_VERSION } from "../version";

const NPM_DIST_TAGS_URL =
  "https://registry.npmjs.org/-/package/%40commet%2Fnode/dist-tags";
const UPDATE_CHECK_TIMEOUT_MS = 3000;

type StableVersion = readonly [number, number, number];

let updateCheckScheduled = false;

function parseStableVersion(version: string): StableVersion | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return null;

  const parsedVersion: StableVersion = [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
  ];

  if (!parsedVersion.every(Number.isSafeInteger)) return null;
  return parsedVersion;
}

export function isNewerVersion(latest: string, installed: string): boolean {
  const latestVersion = parseStableVersion(latest);
  const installedVersion = parseStableVersion(installed);
  if (!latestVersion || !installedVersion) return false;

  for (let index = 0; index < latestVersion.length; index++) {
    if (latestVersion[index] > installedVersion[index]) return true;
    if (latestVersion[index] < installedVersion[index]) return false;
  }

  return false;
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
  if (updateCheckScheduled || !shouldCheckForSdkUpdates()) return;
  updateCheckScheduled = true;

  const scheduledCheck = setImmediate(() => {
    void checkForSdkUpdate(SDK_VERSION);
  });
  scheduledCheck.unref();
}
