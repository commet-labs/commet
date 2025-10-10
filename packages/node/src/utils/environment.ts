import type { Environment } from "../types/common";

/**
 * Check if environment is sandbox
 */
export function isSandbox(environment: Environment): boolean {
  return environment === "sandbox";
}

/**
 * Check if environment is production
 */
export function isProduction(environment: Environment): boolean {
  return environment === "production";
}
