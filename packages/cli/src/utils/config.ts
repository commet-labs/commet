import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

// ~/.commet/auth.json structure
interface AuthConfig {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
  environment: "sandbox" | "production";
}

// .commet (project config) structure
interface ProjectConfig {
  orgId: string;
  orgName: string;
  environment: "sandbox" | "production";
}

// Get paths
function getAuthPath(): string {
  return path.join(os.homedir(), ".commet", "auth.json");
}

function getProjectConfigPath(): string {
  return path.join(process.cwd(), ".commet", "config.json");
}

function getProjectConfigDir(): string {
  return path.join(process.cwd(), ".commet");
}

// Auth config functions
export function authExists(): boolean {
  return fs.existsSync(getAuthPath());
}

export function loadAuth(): AuthConfig | null {
  try {
    const authPath = getAuthPath();
    if (!fs.existsSync(authPath)) {
      return null;
    }
    const data = fs.readFileSync(authPath, "utf8");
    return JSON.parse(data) as AuthConfig;
  } catch {
    return null;
  }
}

export function saveAuth(data: AuthConfig): void {
  const authPath = getAuthPath();
  fs.mkdirSync(path.dirname(authPath), { recursive: true });
  fs.writeFileSync(authPath, JSON.stringify(data, null, 2), "utf8");
}

export function clearAuth(): void {
  const authPath = getAuthPath();
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }
}

// Project config functions
export function projectConfigExists(): boolean {
  return fs.existsSync(getProjectConfigPath());
}

export function loadProjectConfig(): ProjectConfig | null {
  try {
    const configPath = getProjectConfigPath();
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data) as ProjectConfig;
  } catch {
    return null;
  }
}

export function saveProjectConfig(data: ProjectConfig): void {
  const configDir = getProjectConfigDir();
  const configPath = getProjectConfigPath();
  
  // Create .commet directory if it doesn't exist
  fs.mkdirSync(configDir, { recursive: true });
  
  // Write config file
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf8");
}

export function clearProjectConfig(): void {
  const configDir = getProjectConfigDir();
  
  // Remove entire .commet directory
  if (fs.existsSync(configDir)) {
    fs.rmSync(configDir, { recursive: true, force: true });
  }
}
