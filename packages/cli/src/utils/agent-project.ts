import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

export interface PackageManifest {
  name?: string;
  version?: string;
  peerDependencies: Record<string, string>;
}

export interface InstalledCommetPackage {
  name: string;
  declaredRange?: string;
  manifestPath?: string;
  manifest?: PackageManifest;
  documentationPath?: string;
}

export function findProjectRoot(startDirectory: string): string {
  let current = resolve(startDirectory);
  const root = parse(current).root;
  while (true) {
    if (existsSync(join(current, "package.json"))) return current;
    if (current === root) {
      throw new Error(`No package.json found from ${startDirectory}`);
    }
    current = dirname(current);
  }
}

export function findCommetPackages(
  projectRoot: string,
): InstalledCommetPackage[] {
  const projectManifest = readPackageManifest(
    join(projectRoot, "package.json"),
  );
  if (!projectManifest) {
    throw new Error(`Invalid package.json in ${projectRoot}`);
  }

  const declared = readDeclaredDependencies(join(projectRoot, "package.json"));
  const names = new Set(
    Object.keys(declared).filter((name) => name.startsWith("@commet/")),
  );

  for (const name of discoverInstalledCommetPackages(projectRoot)) {
    names.add(name);
  }

  return [...names].sort().map((name) => {
    const manifestPath = findInstalledManifest(projectRoot, name);
    const manifest = manifestPath
      ? readPackageManifest(manifestPath)
      : undefined;
    const packageRoot = manifestPath ? dirname(manifestPath) : undefined;
    const documentationPath = packageRoot
      ? documentationForPackage(name, packageRoot)
      : undefined;
    return {
      name,
      declaredRange: declared[name],
      manifestPath,
      manifest,
      documentationPath,
    };
  });
}

export function documentationForPackage(
  packageName: string,
  packageRoot: string,
): string | undefined {
  const relativePath =
    packageName === "@commet/node" ? join("docs", "README.md") : "README.md";
  const absolutePath = join(packageRoot, relativePath);
  return existsSync(absolutePath) ? absolutePath : undefined;
}

export function readPackageManifest(
  manifestPath: string,
): PackageManifest | undefined {
  if (!existsSync(manifestPath)) return undefined;
  try {
    const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (typeof parsed !== "object" || parsed === null) return undefined;
    return {
      name: readString(parsed, "name"),
      version: readString(parsed, "version"),
      peerDependencies: readStringRecord(parsed, "peerDependencies"),
    };
  } catch {
    return undefined;
  }
}

function readDeclaredDependencies(
  manifestPath: string,
): Record<string, string> {
  const parsed: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (typeof parsed !== "object" || parsed === null) return {};
  return {
    ...readStringRecord(parsed, "dependencies"),
    ...readStringRecord(parsed, "devDependencies"),
    ...readStringRecord(parsed, "optionalDependencies"),
    ...readStringRecord(parsed, "peerDependencies"),
  };
}

function findInstalledManifest(
  projectRoot: string,
  packageName: string,
): string | undefined {
  let current = projectRoot;
  const root = parse(current).root;
  while (true) {
    const candidate = join(
      current,
      "node_modules",
      packageName,
      "package.json",
    );
    if (existsSync(candidate)) return candidate;
    if (current === root) return undefined;
    current = dirname(current);
  }
}

function discoverInstalledCommetPackages(projectRoot: string): string[] {
  let current = projectRoot;
  const root = parse(current).root;
  while (true) {
    const scopePath = join(current, "node_modules", "@commet");
    if (existsSync(scopePath)) {
      return readdirSync(scopePath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
        .map((entry) => `@commet/${entry.name}`);
    }
    if (current === root) return [];
    current = dirname(current);
  }
}

function readString(value: object, property: string): string | undefined {
  const propertyValue = Reflect.get(value, property);
  return typeof propertyValue === "string" ? propertyValue : undefined;
}

function readStringRecord(
  value: object,
  property: string,
): Record<string, string> {
  const propertyValue = Reflect.get(value, property);
  if (typeof propertyValue !== "object" || propertyValue === null) return {};
  return Object.fromEntries(
    Object.entries(propertyValue).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}
