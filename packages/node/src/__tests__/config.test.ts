import { describe, expect, test } from "vitest";
import {
  BILLING_CONFIG_JSON_SCHEMA,
  BillingConfigSchema,
  getBillingConfigIssues,
} from "../index";
import type { BillingConfig } from "../types/config";

function validConfig(): BillingConfig {
  return {
    schemaVersion: 1,
    features: {
      api_calls: { name: "API calls", type: "usage" },
    },
    plans: {
      pro: {
        name: "Pro",
        consumptionModel: "metered",
        defaultInterval: "monthly",
        sortOrder: 0,
        prices: [{ interval: "monthly", amountInCents: 499, trialDays: 0 }],
        features: {
          api_calls: {
            included: 100,
            overage: { unitPrice: 10_000 },
          },
        },
      },
    },
  };
}

describe("billing config contract", () => {
  test("accepts USD 4.99 as 499 cents", () => {
    expect(BillingConfigSchema.parse(validConfig())).toEqual(validConfig());
  });

  test("reports the breaking amount field migration", () => {
    const input = {
      schemaVersion: 1,
      features: {},
      plans: {
        pro: {
          name: "Pro",
          prices: [{ interval: "monthly", amount: 4.99 }],
        },
      },
    };

    expect(getBillingConfigIssues(input)).toContainEqual({
      code: "config_price_field_renamed",
      path: "config.plans.pro.prices[0].amount",
      expected: "Use amountInCents with an integer (499 = $4.99)",
      received: 4.99,
    });
  });

  test.each([
    ["fraction", 4.99],
    ["negative", -1],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["unsafe integer", Number.MAX_SAFE_INTEGER + 1],
  ])("rejects a %s minor-unit amount", (_name, amountInCents) => {
    const input = structuredClone(validConfig());
    input.plans.pro.prices[0]!.amountInCents = amountInCents;

    expect(BillingConfigSchema.safeParse(input).success).toBe(false);
  });

  test("rejects trial days outside the PostgreSQL integer range", () => {
    const input = structuredClone(validConfig());
    input.plans.pro.prices[0]!.trialDays = 2_147_483_648;

    expect(BillingConfigSchema.safeParse(input).success).toBe(false);
  });

  test.each([
    -2_147_483_649, 2_147_483_648,
  ])("rejects sort order %s outside the PostgreSQL integer range", (sortOrder) => {
    const input = structuredClone(validConfig());
    input.plans.pro.sortOrder = sortOrder;

    expect(BillingConfigSchema.safeParse(input).success).toBe(false);
  });

  test.each([
    {
      features: { "API Calls": { name: "API calls", type: "usage" } },
      plans: {},
    },
    {
      features: {},
      plans: {
        "Pro Plan": {
          name: "Pro",
          prices: [],
        },
      },
    },
  ])("rejects non-canonical feature and plan codes", ({ features, plans }) => {
    expect(
      BillingConfigSchema.safeParse({
        schemaVersion: 1,
        features,
        plans,
      }).success,
    ).toBe(false);
  });

  test.each([
    {
      name: "duplicate intervals",
      mutate: (input: ReturnType<typeof validConfig>) => {
        input.plans.pro.prices.push({
          interval: "monthly",
          amountInCents: 999,
        });
      },
      code: "duplicate_price_interval",
    },
    {
      name: "missing default interval price",
      mutate: (input: ReturnType<typeof validConfig>) => {
        input.plans.pro.defaultInterval = "yearly";
      },
      code: "default_interval_missing_price",
    },
    {
      name: "free plan price",
      mutate: (input: ReturnType<typeof validConfig>) => {
        input.plans.pro.isFree = true;
      },
      code: "free_plan_prices_not_allowed",
    },
    {
      name: "one-time trial",
      mutate: (input: ReturnType<typeof validConfig>) => {
        input.plans.pro.prices = [
          { interval: "one_time", amountInCents: 499, trialDays: 7 },
        ];
        input.plans.pro.defaultInterval = "one_time";
      },
      code: "one_time_trial_not_allowed",
    },
    {
      name: "missing feature reference",
      mutate: (input: ReturnType<typeof validConfig>) => {
        const planFeatures = input.plans.pro.features;
        if (!planFeatures) throw new Error("Expected plan features fixture");
        planFeatures.missing = true;
      },
      code: "feature_reference_missing",
    },
  ])("rejects $name", ({ mutate, code }) => {
    const input = structuredClone(validConfig());
    mutate(input);

    expect(getBillingConfigIssues(input).map((issue) => issue.code)).toContain(
      code,
    );
  });

  test("publishes machine-readable schema metadata", () => {
    const schema = JSON.stringify(BILLING_CONFIG_JSON_SCHEMA);
    expect(schema).toContain("amountInCents");
    expect(schema).toContain("schemaVersion");
  });
});
