import { Commet } from "@commet/node";
import type { BillingInterval, CreditPack, Plan, PlanFeature } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";

export interface PricingMarkdownConfig {
  apiKey: string;
  title: string;
  description?: string;
  includeCreditPacks?: boolean;
  billingIntervals?: BillingInterval[];
  cacheMaxAge?: number;
  onError?: (error: Error) => void;
}

const INTERVAL_SHORT: Record<BillingInterval, string> = {
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
};

export const PricingMarkdown = ({
  apiKey,
  title,
  description,
  includeCreditPacks = false,
  billingIntervals,
  cacheMaxAge = 3600,
  onError,
}: PricingMarkdownConfig) => {
  const commet = new Commet({ apiKey });

  return async (_req: NextRequest) => {
    try {
      const plansResult = await commet.plans.list();

      if (!plansResult.success || !plansResult.data) {
        throw new Error(plansResult.message ?? "Failed to fetch plans");
      }

      const publicPlans = plansResult.data.filter((plan) => plan.isPublic);

      const creditPacks = includeCreditPacks
        ? await commet.creditPacks
            .list()
            .then((result) =>
              result.success && result.data ? result.data : [],
            )
        : [];

      const markdown = generateMarkdown(
        title,
        description,
        publicPlans,
        creditPacks,
        billingIntervals,
      );

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${cacheMaxAge * 2}`,
        },
      });
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      onError?.(errorObj);
      console.error("[Commet PricingMarkdown]", errorObj);

      return NextResponse.json(
        { error: "Failed to generate pricing markdown" },
        { status: 500 },
      );
    }
  };
};

function generateMarkdown(
  title: string,
  description: string | undefined,
  plans: Plan[],
  creditPacks: CreditPack[],
  billingIntervals?: BillingInterval[],
): string {
  const sections: string[] = [`# ${title}`];

  if (description) {
    sections.push(description);
  }

  if (plans.length > 0) {
    sections.push(renderPlansTable(plans, billingIntervals));

    const featuresSection = renderFeatures(plans);
    if (featuresSection) {
      sections.push(featuresSection);
    }
  }

  if (creditPacks.length > 0) {
    sections.push(renderCreditPacks(creditPacks));
  }

  return sections.join("\n\n");
}

function renderPlansTable(plans: Plan[], filterIntervals?: BillingInterval[]): string {
  const usageFeatures = collectUsageFeatures(plans);

  const headerCols = ["Plan", "Price"];
  for (const { name, unitName } of usageFeatures) {
    headerCols.push(`${name}/${unitName ?? "unit"}`);
    headerCols.push("Overage");
  }

  const rows = plans.map((plan) => {
    const priceCell = renderPriceCell(plan, filterIntervals);
    const cols = [plan.name, priceCell];

    const featuresByCode = new Map(
      plan.features.map((feature) => [feature.code, feature]),
    );

    for (const { code } of usageFeatures) {
      const feature = featuresByCode.get(code);

      if (!feature) {
        cols.push("—", "—");
        continue;
      }

      if (feature.unlimited) {
        cols.push("Unlimited", "—");
        continue;
      }

      const included = feature.includedAmount;
      cols.push(included ? formatNumber(included) : "—");

      const overagePrice =
        feature.overageEnabled && feature.overageUnitPrice !== undefined
          ? formatRatePrice(feature.overageUnitPrice)
          : "—";
      cols.push(overagePrice);
    }

    return cols;
  });

  const separator = headerCols.map(() => "---");
  const lines = [
    `| ${headerCols.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...rows.map((cols) => `| ${cols.join(" | ")} |`),
  ];

  const footnotes: string[] = [];

  const trialPlans = plans.filter((plan) =>
    plan.prices.some((price) => price.trialDays > 0),
  );
  for (const plan of trialPlans) {
    const trialPrice = plan.prices.find((price) => price.trialDays > 0)!;
    footnotes.push(
      `*${plan.name} plan includes a ${trialPrice.trialDays}-day free trial.*`,
    );
  }

  if (usageFeatures.length > 0) {
    footnotes.push(
      "The overage rate applies only to usage beyond the included volume.",
    );
  }

  return footnotes.length > 0
    ? `## Plans\n\n${lines.join("\n")}\n\n${footnotes.join("\n\n")}`
    : `## Plans\n\n${lines.join("\n")}`;
}

function renderPriceCell(plan: Plan, filterIntervals?: BillingInterval[]): string {
  if (plan.isFree) return "Free";

  const prices = filterIntervals
    ? plan.prices.filter((price) => filterIntervals.includes(price.billingInterval))
    : plan.prices;

  if (prices.length === 0) return "—";

  return prices
    .map((price) => {
      if (price.price === 0) return "Free";
      return `${formatSettlementPrice(price.price)}${INTERVAL_SHORT[price.billingInterval]}`;
    })
    .join(" / ");
}

function renderFeatures(plans: Plan[]): string | null {
  const allBooleanCodes = new Set<string>();
  for (const plan of plans) {
    for (const feature of plan.features) {
      if (feature.type === "boolean") {
        allBooleanCodes.add(feature.code);
      }
    }
  }

  if (allBooleanCodes.size === 0) return null;

  const enabledOnAll = new Set<string>();
  for (const code of allBooleanCodes) {
    const enabledOnEveryPlan = plans.every((plan) => {
      const feature = plan.features.find((f) => f.code === code);
      return feature?.enabled;
    });
    if (enabledOnEveryPlan) {
      enabledOnAll.add(code);
    }
  }

  const perPlanLines: string[] = [];
  for (const plan of plans) {
    const uniqueFeatures = plan.features
      .filter(
        (feature) =>
          feature.type === "boolean" &&
          feature.enabled &&
          !enabledOnAll.has(feature.code),
      )
      .map((feature) => feature.name);

    if (uniqueFeatures.length > 0) {
      perPlanLines.push(`- **${plan.name}**: ${uniqueFeatures.join(", ")}`);
    }
  }

  const commonFeatures = plans[0]?.features
    .filter(
      (feature) =>
        feature.type === "boolean" && enabledOnAll.has(feature.code),
    )
    .map((feature) => feature.name);

  const parts: string[] = [];

  if (perPlanLines.length > 0) {
    parts.push(perPlanLines.join("\n"));
  }

  if (commonFeatures && commonFeatures.length > 0) {
    parts.push(`All plans include: ${commonFeatures.join(", ")}.`);
  }

  return parts.length > 0 ? `## Features\n\n${parts.join("\n\n")}` : null;
}

function renderCreditPacks(packs: CreditPack[]): string {
  const lines = [
    "| Pack | Credits | Price |",
    "| --- | --- | --- |",
    ...packs.map(
      (pack) =>
        `| ${pack.name} | ${formatNumber(pack.credits)} credits | ${formatSettlementPrice(pack.price)} |`,
    ),
  ];

  return `## Credit Packs\n\n${lines.join("\n")}`;
}

interface UsageFeatureColumn {
  code: string;
  name: string;
  unitName: string | null;
}

function collectUsageFeatures(plans: Plan[]): UsageFeatureColumn[] {
  const seen = new Map<string, UsageFeatureColumn>();
  for (const plan of plans) {
    for (const feature of plan.features) {
      if (
        (feature.type === "metered" || feature.type === "seats") &&
        !seen.has(feature.code) &&
        hasUsageData(feature)
      ) {
        seen.set(feature.code, {
          code: feature.code,
          name: feature.name,
          unitName: feature.unitName,
        });
      }
    }
  }
  return Array.from(seen.values());
}

function hasUsageData(feature: PlanFeature): boolean {
  return (
    feature.unlimited === true ||
    (feature.includedAmount !== undefined && feature.includedAmount > 0) ||
    (feature.overageEnabled === true && feature.overageUnitPrice !== undefined)
  );
}

function formatSettlementPrice(cents: number): string {
  if (cents === 0) return "Free";
  const dollars = cents / 100;
  const [whole, decimal] = dollars.toFixed(2).split(".");
  return `$${Number(whole).toLocaleString("en-US")}.${decimal}`;
}

function formatRatePrice(rate: number): string {
  const dollars = rate / 10000;

  if (dollars === Math.floor(dollars)) {
    return `$${dollars.toFixed(2)}`;
  }

  const formatted = dollars.toFixed(4).replace(/0+$/, "");
  const decimalPlaces = formatted.split(".")[1]?.length ?? 0;
  if (decimalPlaces < 2) {
    return `$${dollars.toFixed(2)}`;
  }

  return `$${formatted}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
