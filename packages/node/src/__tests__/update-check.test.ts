import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkForSdkUpdate,
  isNewerVersion,
  shouldCheckForSdkUpdates,
} from "../utils/update-check";

function distTagsResponse(latest: unknown, status = 200): Response {
  return new Response(JSON.stringify({ latest }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("SDK update check", () => {
  it("compares stable versions", () => {
    expect(isNewerVersion("7.7.0", "7.1.0")).toBe(true);
    expect(isNewerVersion("7.7.1", "7.7.0")).toBe(true);
    expect(isNewerVersion("8.0.0", "7.7.0")).toBe(true);
    expect(isNewerVersion("7.7.0", "7.7.0")).toBe(false);
    expect(isNewerVersion("7.6.0", "7.7.0")).toBe(false);
    expect(isNewerVersion("canary", "7.7.0")).toBe(false);
  });

  it("only enables checks during local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(shouldCheckForSdkUpdates()).toBe(true);

    vi.stubEnv("CI", "true");
    expect(shouldCheckForSdkUpdates()).toBe(false);

    vi.stubEnv("CI", "");
    vi.stubEnv("COMMET_NO_UPDATE_CHECK", "1");
    expect(shouldCheckForSdkUpdates()).toBe(false);

    vi.stubEnv("COMMET_NO_UPDATE_CHECK", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(shouldCheckForSdkUpdates()).toBe(false);
  });

  it("warns when npm reports a newer version", async () => {
    const fetchMock = vi.fn().mockResolvedValue(distTagsResponse("7.7.0"));
    const warnMock = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", fetchMock);

    await checkForSdkUpdate("7.1.0");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://registry.npmjs.org/-/package/%40commet%2Fnode/dist-tags",
      { signal: expect.any(AbortSignal) },
    );
    expect(warnMock).toHaveBeenCalledWith(
      "[Commet] @commet/node 7.1.0 is out of date. The latest version is 7.7.0.\nUpdate with: npm install @commet/node@latest",
    );
  });

  it("does not warn for the latest or a newer installed version", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(distTagsResponse("7.7.0"))
      .mockResolvedValueOnce(distTagsResponse("7.7.0"));
    const warnMock = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", fetchMock);

    await checkForSdkUpdate("7.7.0");
    await checkForSdkUpdate("8.0.0");

    expect(warnMock).not.toHaveBeenCalled();
  });

  it("ignores registry failures and invalid responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(distTagsResponse("7.8.0", 500))
      .mockResolvedValueOnce(distTagsResponse(null))
      .mockRejectedValueOnce(new Error("registry unavailable"));
    const warnMock = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", fetchMock);

    await expect(checkForSdkUpdate("7.7.0")).resolves.toBeUndefined();
    await expect(checkForSdkUpdate("7.7.0")).resolves.toBeUndefined();
    await expect(checkForSdkUpdate("7.7.0")).resolves.toBeUndefined();

    expect(warnMock).not.toHaveBeenCalled();
  });

  it("schedules at most one registry request per process", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "development");
    const fetchMock = vi.fn().mockResolvedValue(distTagsResponse("7.7.0"));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { scheduleSdkUpdateCheck } = await import("../utils/update-check");

    scheduleSdkUpdateCheck();
    scheduleSdkUpdateCheck();

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
