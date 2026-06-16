const PLAN_ENTITLEMENTS = {
  free: { projectLimit: 1, advancedAnalytics: false },
  pro: { projectLimit: 10, advancedAnalytics: true },
  business: { projectLimit: 100, advancedAnalytics: true },
} as const;

export type PlanKey = keyof typeof PLAN_ENTITLEMENTS;

export interface PlanEntitlements {
  planKey: PlanKey;
  projectLimit: number;
  advancedAnalytics: boolean;
}

function isPlanKey(value: string): value is PlanKey {
  return value in PLAN_ENTITLEMENTS;
}

export function resolveEntitlementsForPlan(plan: string): PlanEntitlements {
  const planKey = plan.toLowerCase();
  if (!isPlanKey(planKey)) {
    throw new Error(
      `Unknown plan "${plan}". Add it to PLAN_ENTITLEMENTS so this app knows its limits.`,
    );
  }
  return { planKey, ...PLAN_ENTITLEMENTS[planKey] };
}
