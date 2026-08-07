import { z } from "zod";

export const BILLING_CONFIG_SCHEMA_VERSION = 1 as const;

const configCodeSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9_]+$/,
    "Must contain lowercase letters, numbers, or underscores",
  );

const POSTGRES_INTEGER_MIN = -2_147_483_648;
const POSTGRES_INTEGER_MAX = 2_147_483_647;

const safeNonNegativeIntegerSchema = z
  .number()
  .int()
  .nonnegative()
  .refine(Number.isSafeInteger, "Must be a safe integer");

const postgresNonNegativeIntegerSchema = z
  .number()
  .int()
  .nonnegative()
  .max(POSTGRES_INTEGER_MAX, "Must fit in a PostgreSQL integer");

const postgresIntegerSchema = z
  .number()
  .int()
  .min(POSTGRES_INTEGER_MIN, "Must fit in a PostgreSQL integer")
  .max(POSTGRES_INTEGER_MAX, "Must fit in a PostgreSQL integer");

const featureDescriptionSchema = {
  name: z.string().min(1),
  unitName: z.string().min(1).optional(),
  description: z.string().optional(),
};

export const FeatureDefSchema = z.discriminatedUnion("type", [
  z.strictObject({
    name: featureDescriptionSchema.name,
    type: z.literal("boolean"),
    description: featureDescriptionSchema.description,
  }),
  z.strictObject({
    ...featureDescriptionSchema,
    type: z.literal("usage"),
  }),
  z.strictObject({
    ...featureDescriptionSchema,
    type: z.literal("seats"),
  }),
  z.strictObject({
    ...featureDescriptionSchema,
    type: z.literal("quota"),
  }),
]);

export const PriceDefSchema = z.strictObject({
  interval: z.enum(["weekly", "monthly", "quarterly", "yearly", "one_time"]),
  amountInCents: safeNonNegativeIntegerSchema,
  trialDays: postgresNonNegativeIntegerSchema.optional(),
});

const meteredPlanFeatureValueSchema = z.strictObject({
  included: safeNonNegativeIntegerSchema.optional(),
  unlimited: z.boolean().optional(),
  overage: z
    .strictObject({ unitPrice: safeNonNegativeIntegerSchema.positive() })
    .optional(),
});

export const PlanFeatureValueSchema = z.union([
  z.boolean(),
  meteredPlanFeatureValueSchema,
]);

export const PlanDefSchema = z.strictObject({
  name: z.string().min(1),
  description: z.string().optional(),
  consumptionModel: z.enum(["metered", "credits", "balance"]).optional(),
  defaultInterval: PriceDefSchema.shape.interval.optional(),
  isFree: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: postgresIntegerSchema.optional(),
  prices: z.array(PriceDefSchema),
  features: z.record(configCodeSchema, PlanFeatureValueSchema).optional(),
});

function addConfigIssue(
  context: z.RefinementCtx,
  path: PropertyKey[],
  code: string,
  expected: string,
): void {
  context.addIssue({
    code: "custom",
    path,
    message: expected,
    params: { configCode: code, expected },
  });
}

export const BillingConfigSchema = z
  .strictObject({
    schemaVersion: z.literal(BILLING_CONFIG_SCHEMA_VERSION),
    features: z.record(configCodeSchema, FeatureDefSchema),
    plans: z.record(configCodeSchema, PlanDefSchema),
  })
  .superRefine((config, context) => {
    const planNames = new Set<string>();
    for (const [planCode, plan] of Object.entries(config.plans)) {
      if (planNames.has(plan.name)) {
        addConfigIssue(
          context,
          ["plans", planCode, "name"],
          "duplicate_plan_name",
          "Plan names must be unique",
        );
      }
      planNames.add(plan.name);

      const intervals = new Set<string>();
      for (const [priceIndex, price] of plan.prices.entries()) {
        if (intervals.has(price.interval)) {
          addConfigIssue(
            context,
            ["plans", planCode, "prices", priceIndex, "interval"],
            "duplicate_price_interval",
            "Each billing interval can appear only once per plan",
          );
        }
        intervals.add(price.interval);

        if (price.interval === "one_time" && (price.trialDays ?? 0) > 0) {
          addConfigIssue(
            context,
            ["plans", planCode, "prices", priceIndex, "trialDays"],
            "one_time_trial_not_allowed",
            "One-time prices cannot have trial days",
          );
        }
      }

      if (plan.isFree === true && plan.prices.length > 0) {
        addConfigIssue(
          context,
          ["plans", planCode, "prices"],
          "free_plan_prices_not_allowed",
          "Free plans cannot define prices",
        );
      }

      if (plan.prices.length > 0 && plan.defaultInterval === undefined) {
        addConfigIssue(
          context,
          ["plans", planCode, "defaultInterval"],
          "default_interval_required",
          "A default interval is required when prices are defined",
        );
      }

      if (
        plan.defaultInterval !== undefined &&
        !intervals.has(plan.defaultInterval)
      ) {
        addConfigIssue(
          context,
          ["plans", planCode, "defaultInterval"],
          "default_interval_missing_price",
          "The default interval must match one configured price",
        );
      }

      for (const [featureCode, featureValue] of Object.entries(
        plan.features ?? {},
      )) {
        const feature = config.features[featureCode];
        if (!feature) {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode],
            "feature_reference_missing",
            "The referenced feature must exist in config.features",
          );
          continue;
        }

        if (feature.type === "usage" && !plan.consumptionModel) {
          addConfigIssue(
            context,
            ["plans", planCode, "consumptionModel"],
            "usage_feature_requires_consumption_model",
            "Plans with usage features must define a consumption model",
          );
        }

        if (typeof featureValue === "boolean") continue;

        if (feature.type === "boolean") {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode],
            "boolean_feature_value_invalid",
            "Boolean features must use true or false",
          );
        }

        if (featureValue.unlimited === true && featureValue.overage) {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode, "overage"],
            "unlimited_feature_overage_not_allowed",
            "Unlimited features cannot define overage pricing",
          );
        }

        if (
          featureValue.unlimited === true &&
          (featureValue.included ?? 0) > 0
        ) {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode, "included"],
            "unlimited_feature_included_not_allowed",
            "Unlimited features cannot define an included amount",
          );
        }

        if (
          featureValue.overage &&
          plan.consumptionModel !== "metered" &&
          plan.consumptionModel !== "balance"
        ) {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode, "overage"],
            "overage_consumption_model_invalid",
            "Overage pricing requires the metered or balance consumption model",
          );
        }

        if (plan.isFree === true && featureValue.overage) {
          addConfigIssue(
            context,
            ["plans", planCode, "features", featureCode, "overage"],
            "free_plan_overage_not_allowed",
            "Free plans cannot define overage pricing",
          );
        }
      }
    }
  });

export const BILLING_CONFIG_STRUCTURAL_JSON_SCHEMA =
  z.toJSONSchema(BillingConfigSchema);

export type FeatureDef = z.infer<typeof FeatureDefSchema>;
export type PriceDef = z.infer<typeof PriceDefSchema>;
export type PlanFeatureValue = z.infer<typeof PlanFeatureValueSchema>;
export type PlanDef = z.infer<typeof PlanDefSchema>;
export type BillingConfig = z.infer<typeof BillingConfigSchema>;

export interface BillingConfigIssue {
  code: string;
  path: string;
  expected: string;
  received: unknown;
}

function getPathValue(input: unknown, path: PropertyKey[]): unknown {
  let current = input;
  for (const segment of path) {
    if (typeof current !== "object" || current === null) return undefined;
    current = Reflect.get(current, segment);
  }
  return current;
}

function serializeReceivedValue(value: unknown): unknown {
  if (value === undefined) return "<missing>";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  if (value === Number.POSITIVE_INFINITY) return "Infinity";
  if (value === Number.NEGATIVE_INFINITY) return "-Infinity";
  return value;
}

function getStringProperty(input: unknown, property: PropertyKey) {
  if (typeof input !== "object" || input === null) return undefined;
  const value = Reflect.get(input, property);
  return typeof value === "string" ? value : undefined;
}

function formatConfigPath(path: PropertyKey[]): string {
  return path.reduce<string>((formatted, segment) => {
    if (typeof segment === "number") return `${formatted}[${segment}]`;
    return `${formatted}.${String(segment)}`;
  }, "config");
}

function expectedForZodIssue(issue: z.core.$ZodIssue): string {
  if (issue.code === "invalid_type") return `Expected ${issue.expected}`;
  if (issue.code === "invalid_value") return issue.message;
  if (issue.code === "too_small") return issue.message;
  if (issue.code === "too_big") return issue.message;
  return issue.message;
}

export function getBillingConfigIssues(input: unknown): BillingConfigIssue[] {
  const parsed = BillingConfigSchema.safeParse(input, { reportInput: true });
  if (parsed.success) return [];

  const legacyPricePaths = new Set(
    parsed.error.issues
      .filter(
        (issue) =>
          issue.code === "unrecognized_keys" && issue.keys.includes("amount"),
      )
      .map((issue) => issue.path.join(".")),
  );

  return parsed.error.issues.flatMap((issue): BillingConfigIssue[] => {
    if (
      issue.code === "invalid_type" &&
      issue.path[issue.path.length - 1] === "amountInCents" &&
      legacyPricePaths.has(issue.path.slice(0, -1).join("."))
    ) {
      return [];
    }

    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((key) => {
        const path = [...issue.path, key];
        const renamedPriceField = key === "amount";
        return {
          code: renamedPriceField
            ? "config_price_field_renamed"
            : "config_field_unknown",
          path: formatConfigPath(path),
          expected: renamedPriceField
            ? "Use amountInCents with an integer (499 = $4.99)"
            : "Remove the unknown field",
          received: serializeReceivedValue(getPathValue(input, path)),
        };
      });
    }

    const configCode =
      issue.code === "custom"
        ? getStringProperty(issue.params, "configCode")
        : undefined;
    const customExpected =
      issue.code === "custom"
        ? getStringProperty(issue.params, "expected")
        : undefined;

    return [
      {
        code: configCode ?? `config_${issue.code}`,
        path: formatConfigPath(issue.path),
        expected: customExpected ?? expectedForZodIssue(issue),
        received: serializeReceivedValue(getPathValue(input, issue.path)),
      },
    ];
  });
}

export function parseBillingConfig(input: unknown): BillingConfig {
  return BillingConfigSchema.parse(input);
}

export function defineConfig<const T extends BillingConfig>(config: T): T {
  return config;
}

export type InferFeatureCodes<T> = T extends { features: infer F }
  ? keyof F & string
  : never;

export type InferPlanCodes<T> = T extends { plans: infer P }
  ? keyof P & string
  : never;

export type InferSeatCodes<T> = T extends { features: infer F }
  ? {
      [K in keyof F]: F[K] extends { type: "seats" } ? K & string : never;
    }[keyof F]
  : never;

export type InferUsageCodes<T> = T extends { features: infer F }
  ? {
      [K in keyof F]: F[K] extends { type: "usage" } ? K & string : never;
    }[keyof F]
  : never;
