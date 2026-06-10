import type { Feature, Plan } from "@commet/node";

export function generateConfigFile(features: Feature[], plans: Plan[]): string {
  const lines: string[] = [];

  lines.push('import { defineConfig } from "@commet/node";');
  lines.push("");
  lines.push("export default defineConfig({");

  lines.push("  features: {");
  for (const f of features) {
    const parts: string[] = [`name: "${f.name}"`, `type: "${f.type}"`];
    if (f.unitName) parts.push(`unitName: "${f.unitName}"`);
    if (f.description) parts.push(`description: "${f.description}"`);
    lines.push(`    ${f.code}: { ${parts.join(", ")} },`);
  }
  lines.push("  },");

  lines.push("  plans: {");
  for (const p of plans) {
    lines.push(`    ${p.code}: {`);
    lines.push(`      name: "${p.name}",`);
    if (p.description) lines.push(`      description: "${p.description}",`);
    if (p.consumptionModel)
      lines.push(`      consumptionModel: "${p.consumptionModel}",`);
    if (p.isFree) lines.push("      isFree: true,");
    if (p.isPublic === false) lines.push("      isPublic: false,");
    if (p.sortOrder != null && p.sortOrder !== 0)
      lines.push(`      sortOrder: ${p.sortOrder},`);

    const prices = p.prices ?? [];
    const defaultInterval =
      prices.find((pr) => pr.isDefault)?.billingInterval ??
      prices[0]?.billingInterval;
    if (defaultInterval)
      lines.push(`      defaultInterval: "${defaultInterval}",`);

    if (prices.length === 0) {
      lines.push("      prices: [],");
    } else {
      lines.push("      prices: [");
      for (const price of prices) {
        const priceParts = [
          `interval: "${price.billingInterval}"`,
          `amount: ${price.price}`,
        ];
        if (price.trialDays) priceParts.push(`trialDays: ${price.trialDays}`);
        lines.push(`        { ${priceParts.join(", ")} },`);
      }
      lines.push("      ],");
    }

    const planFeatures = p.features ?? [];
    if (planFeatures.length > 0) {
      lines.push("      features: {");
      for (const pf of planFeatures) {
        const isSimpleBoolean =
          pf.includedAmount == null && !pf.unlimited && !pf.overage?.enabled;

        if (isSimpleBoolean) {
          lines.push(`        ${pf.code}: ${pf.enabled},`);
        } else {
          const parts: string[] = [];
          if (pf.includedAmount != null)
            parts.push(`included: ${pf.includedAmount}`);
          if (pf.unlimited) parts.push("unlimited: true");
          if (pf.overage?.enabled && pf.overage.unitPrice != null) {
            parts.push(`overage: { unitPrice: ${pf.overage.unitPrice} }`);
          }
          if (parts.length > 0) {
            lines.push(`        ${pf.code}: { ${parts.join(", ")} },`);
          } else {
            lines.push(`        ${pf.code}: {},`);
          }
        }
      }
      lines.push("      },");
    }

    lines.push("    },");
  }
  lines.push("  },");

  lines.push("});");
  lines.push("");

  return lines.join("\n");
}
