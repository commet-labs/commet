import { describe, expect, it } from "vitest";
import {
  isNewerVersion,
  shouldCheckForSdkUpdates,
} from "../utils/update-check";

describe("SDK update check", () => {
  it("compares stable versions", () => {
    expect(isNewerVersion("7.7.0", "7.1.0")).toBe(true);
    expect(isNewerVersion("7.7.1", "7.7.0")).toBe(true);
    expect(isNewerVersion("8.0.0", "7.7.0")).toBe(true);
    expect(isNewerVersion("7.7.0", "7.7.0-beta.1")).toBe(true);
    expect(isNewerVersion("7.7.0-beta.10", "7.7.0-beta.2")).toBe(true);
    expect(isNewerVersion("7.7.0", "7.7.0")).toBe(false);
    expect(isNewerVersion("7.6.0", "7.7.0")).toBe(false);
    expect(isNewerVersion("canary", "7.7.0")).toBe(false);
  });

  it("only enables checks during local development", () => {
    expect(shouldCheckForSdkUpdates({ NODE_ENV: "development" })).toBe(true);
    expect(
      shouldCheckForSdkUpdates({ NODE_ENV: "development", CI: "true" }),
    ).toBe(false);
    expect(
      shouldCheckForSdkUpdates({
        NODE_ENV: "development",
        COMMET_NO_UPDATE_CHECK: "1",
      }),
    ).toBe(false);
    expect(shouldCheckForSdkUpdates({ NODE_ENV: "production" })).toBe(false);
  });
});
