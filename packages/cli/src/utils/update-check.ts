import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import chalk from "chalk";

const CACHE_FILE = path.join(os.homedir(), ".commet", ".update-check");
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const REGISTRY_URL = "https://registry.npmjs.org/commet/latest";

interface UpdateCache {
  latestVersion: string;
  checkedAt: number;
}

function isNewerVersion(latest: string, current: string): boolean {
  const l = latest.split(".").map(Number);
  const c = current.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((l[i] ?? 0) > (c[i] ?? 0)) return true;
    if ((l[i] ?? 0) < (c[i] ?? 0)) return false;
  }
  return false;
}

function readCache(): UpdateCache | null {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as UpdateCache;
  } catch {
    return null;
  }
}

function writeCache(cache: UpdateCache): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), "utf8");
  } catch {}
}

function shouldSkip(): boolean {
  if (process.env.COMMET_NO_UPDATE_CHECK === "1") return true;
  if (process.env.CI) return true;
  const idx = process.argv.indexOf("--output");
  if (idx !== -1 && process.argv[idx + 1] === "agent") return true;
  return false;
}

let updateAvailable: string | null = null;

export function scheduleUpdateCheck(currentVersion: string): void {
  if (shouldSkip()) return;

  const cache = readCache();

  if (cache && isNewerVersion(cache.latestVersion, currentVersion)) {
    updateAvailable = cache.latestVersion;
  }

  const needsFetch = !cache || Date.now() - cache.checkedAt > CHECK_INTERVAL_MS;
  if (!needsFetch) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  fetch(REGISTRY_URL, { signal: controller.signal })
    .then((r) => r.json() as Promise<{ version: string }>)
    .then((data) => {
      writeCache({ latestVersion: data.version, checkedAt: Date.now() });
      if (!updateAvailable && isNewerVersion(data.version, currentVersion)) {
        updateAvailable = data.version;
      }
    })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}

export function printUpdateNotification(currentVersion: string): void {
  if (!updateAvailable) return;

  console.log("");
  console.log(
    `  Update available: ${chalk.dim(currentVersion)} → ${chalk.green(updateAvailable)}`,
  );
  console.log(chalk.dim(`  Run: npm i -g commet@latest`));
}
