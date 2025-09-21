import type { Environment } from "../types/common";

/**
 * Detect the current environment based on NODE_ENV and hostname
 */
export function detectEnvironment(): Environment {
  try {
    if (typeof process !== "undefined" && process.env?.NODE_ENV) {
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        return "development";
      }
    }

    if (typeof window !== "undefined" && window.location) {
      const hostname = window.location.hostname;
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.endsWith(".local")
      ) {
        return "development";
      }
    }
  } catch (error) {
    // Ignore errors in environment detection
  }

  return "production";
}

export function isDevelopment(environment: Environment): boolean {
  return environment === "development";
}

export function isProduction(environment: Environment): boolean {
  return environment === "production";
}
