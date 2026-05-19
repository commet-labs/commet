export type FeatureDef =
  | { name: string; type: "boolean"; description?: string }
  | {
      name: string;
      type: "usage";
      unitName?: string;
      description?: string;
    }
  | {
      name: string;
      type: "seats";
      unitName?: string;
      description?: string;
    };

export interface PriceDef {
  interval: "weekly" | "monthly" | "quarterly" | "yearly" | "one_time";
  /** Rate scale: 10000 = $1.00 */
  amount: number;
  trialDays?: number;
}

export type PlanFeatureValue =
  | boolean
  | {
      included?: number;
      unlimited?: boolean;
      overage?: { unitPrice: number };
    };

export interface PlanDef {
  name: string;
  description?: string;
  consumptionModel?: "metered" | "credits" | "balance";
  isFree?: boolean;
  isPublic?: boolean;
  sortOrder?: number;
  prices: PriceDef[];
  features?: Record<string, PlanFeatureValue>;
}

export interface BillingConfig {
  features: Record<string, FeatureDef>;
  plans: Record<string, PlanDef>;
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
