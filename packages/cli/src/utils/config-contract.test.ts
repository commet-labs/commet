import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BillingConfig, Feature, Plan } from "@commet/node";
import { afterEach, describe, expect, test } from "vitest";
import {
  createPushRequestBody,
  getPushExitCode,
  type PushResponse,
} from "../commands/push";
import {
  parseNonNegativeInteger,
  parseNonNegativeNumber,
  parseNonNegativePostgresInteger,
  parseNumber,
  parsePositiveInteger,
  parsePositivePostgresInteger,
  parseSafeInteger,
} from "../commands/resources/param-types";
import {
  BillingConfigValidationError,
  loadBillingConfig,
} from "./config-loader";
import { computeDiff, formatDiff, type RemoteState } from "./diff";
import { generateConfigFile } from "./generator";

const temporaryDirectories: string[] = [];

function config(): BillingConfig {
  return {
    schemaVersion: 1,
    features: {},
    plans: {
      pro: {
        name: "Pro",
        defaultInterval: "monthly",
        prices: [{ interval: "monthly", amountInCents: 499 }],
      },
    },
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("config generation and sync", () => {
  test("generates a versioned 499-cent config that loads unchanged", async () => {
    const features: Feature[] = [];
    const plans: Plan[] = [
      {
        id: "plan_123",
        code: "pro",
        name: "Pro",
        description: null,
        consumptionModel: null,
        isDefault: false,
        isFree: false,
        isPublic: true,
        blockOnExhaustion: null,
        sortOrder: 0,
        planGroupId: null,
        metadata: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        updatedAt: "2026-08-06T00:00:00.000Z",
        features: [],
        prices: [
          {
            id: "price_123",
            billingInterval: "monthly",
            price: 499,
            isDefault: true,
            trialDays: 0,
            includedBalance: null,
            includedCredits: null,
            offerId: null,
            inheritsFromPriceId: null,
            metadata: {},
            marketPrices: [],
            regionalPrices: [],
          },
          {
            id: "price_456",
            billingInterval: "monthly",
            price: 699,
            isDefault: false,
            trialDays: 0,
            includedBalance: null,
            includedCredits: null,
            offerId: null,
            inheritsFromPriceId: "price_base",
            metadata: {},
            marketPrices: [],
            regionalPrices: [],
          },
        ],
        exchangeRates: [],
        object: "plan",
        livemode: false,
      },
    ];
    const generated = generateConfigFile(features, plans);
    const directory = await mkdtemp(
      path.join(process.cwd(), ".commet-config-test-"),
    );
    temporaryDirectories.push(directory);
    await writeFile(path.join(directory, "commet.config.ts"), generated);

    const loaded = await loadBillingConfig(directory);

    expect(loaded.config.schemaVersion).toBe(1);
    expect(loaded.config.plans.pro?.prices[0]?.amountInCents).toBe(499);
    expect(loaded.config.plans.pro?.prices).toHaveLength(1);
    expect(generated).not.toContain("amount: 499");
  });

  test("rejects the old fractional amount locally", async () => {
    const directory = await mkdtemp(
      path.join(process.cwd(), ".commet-config-test-"),
    );
    temporaryDirectories.push(directory);
    await writeFile(
      path.join(directory, "commet.config.ts"),
      `export default { schemaVersion: 1, features: {}, plans: { pro: { name: "Pro", defaultInterval: "monthly", prices: [{ interval: "monthly", amount: 4.99 }] } } };`,
    );

    const error = await loadBillingConfig(directory).catch(
      (loadError: unknown) => loadError,
    );

    expect(error).toBeInstanceOf(BillingConfigValidationError);
    if (!(error instanceof BillingConfigValidationError)) {
      throw new Error("Expected billing config validation to fail");
    }
    expect(error.issues).toContainEqual(
      expect.objectContaining({
        code: "config_price_field_renamed",
        path: "config.plans.pro.prices[0].amount",
        received: 4.99,
      }),
    );
  });

  test("renders base-price diffs at cent scale", () => {
    const remoteState: RemoteState = {
      features: [],
      plans: [
        {
          code: "pro",
          name: "Pro",
          description: null,
          consumptionModel: null,
          isFree: false,
          isPublic: true,
          sortOrder: 0,
          prices: [
            {
              billingInterval: "monthly",
              price: 500,
              trialDays: 0,
              isDefault: true,
            },
          ],
          features: [],
        },
      ],
    };

    expect(formatDiff(computeDiff(config(), remoteState))).toContain(
      "$5.00 → $4.99",
    );
  });

  test("detects non-price config field changes before push", () => {
    const localConfig = config();
    localConfig.plans.pro!.prices[0]!.trialDays = 14;
    const remoteState: RemoteState = {
      features: [],
      plans: [
        {
          code: "pro",
          name: "Pro",
          description: null,
          consumptionModel: null,
          isFree: false,
          isPublic: true,
          sortOrder: 0,
          prices: [
            {
              billingInterval: "monthly",
              price: 499,
              trialDays: 0,
              isDefault: true,
            },
          ],
          features: [],
        },
      ],
    };

    expect(
      computeDiff(localConfig, remoteState).plans.changes[0],
    ).toMatchObject({
      action: "update",
      changes: ["price monthly trialDays: 0 → 14"],
    });
  });

  test("sends the complete versioned config", () => {
    expect(createPushRequestBody(config(), "org_123")).toEqual({
      config: config(),
      orgId: "org_123",
    });
  });
});

describe("push exit semantics", () => {
  function response(): PushResponse {
    return {
      success: true,
      features: { created: [], updated: [], errors: [] },
      plans: { created: [], updated: [], errors: [] },
    };
  }

  test("returns zero only for a complete success", () => {
    expect(getPushExitCode(response())).toBe(0);
  });

  test("returns non-zero for explicit and per-item failures", () => {
    const rejected = response();
    rejected.success = false;
    expect(getPushExitCode(rejected)).toBe(1);

    const partial = response();
    partial.plans.errors.push({
      code: "plan_price_update_failed",
      path: "config.plans.pro.prices[0]",
      message: "Failed to update price",
    });
    expect(getPushExitCode(partial)).toBe(1);
  });
});

describe("resource number parsing", () => {
  test.each([
    "NaN",
    "Infinity",
    "-Infinity",
  ])("rejects non-finite %s", (value) => {
    expect(() => parseNumber(value)).toThrow();
  });

  test("enforces integer domains", () => {
    expect(() => parseSafeInteger("4.99")).toThrow();
    expect(() =>
      parseSafeInteger(String(Number.MAX_SAFE_INTEGER + 1)),
    ).toThrow();
    expect(() => parseNonNegativeInteger("-1")).toThrow();
    expect(() => parseNonNegativeNumber("-0.1")).toThrow();
    expect(parseNonNegativeNumber("4.99")).toBe(4.99);
    expect(() => parsePositiveInteger("0")).toThrow();
    expect(parseNonNegativeInteger("499")).toBe(499);
    expect(() => parseNonNegativePostgresInteger("2147483648")).toThrow();
    expect(() => parsePositivePostgresInteger("2147483648")).toThrow();
    expect(parseNonNegativePostgresInteger("2147483647")).toBe(2_147_483_647);
  });
});
