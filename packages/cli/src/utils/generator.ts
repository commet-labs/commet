import {
  BILLING_CONFIG_SCHEMA_VERSION,
  type Feature,
  type Plan,
} from "@commet/node";
import { remoteStateToBillingConfig } from "./config-mapping";

function quote(value: string): string {
  return JSON.stringify(value);
}

export function generateConfigFile(features: Feature[], plans: Plan[]): string {
  const config = remoteStateToBillingConfig(features, plans);
  const lines: string[] = [];

  lines.push('import { defineConfig } from "@commet/node";');
  lines.push("");
  lines.push("export default defineConfig({");
  lines.push(`  schemaVersion: ${BILLING_CONFIG_SCHEMA_VERSION},`);

  lines.push("  features: {");
  for (const [code, configFeature] of Object.entries(config.features)) {
    const parts: string[] = [
      `name: ${quote(configFeature.name)}`,
      `type: ${quote(configFeature.type)}`,
    ];
    if ("unitName" in configFeature && configFeature.unitName) {
      parts.push(`unitName: ${quote(configFeature.unitName)}`);
    }
    if (configFeature.description) {
      parts.push(`description: ${quote(configFeature.description)}`);
    }
    lines.push(`    ${quote(code)}: { ${parts.join(", ")} },`);
  }
  lines.push("  },");

  lines.push("  plans: {");
  for (const [code, configPlan] of Object.entries(config.plans)) {
    lines.push(`    ${quote(code)}: {`);
    lines.push(`      name: ${quote(configPlan.name)},`);
    if (configPlan.description) {
      lines.push(`      description: ${quote(configPlan.description)},`);
    }
    if (configPlan.consumptionModel) {
      lines.push(
        `      consumptionModel: ${quote(configPlan.consumptionModel)},`,
      );
    }
    if (configPlan.isFree) lines.push("      isFree: true,");
    if (configPlan.isPublic === false) lines.push("      isPublic: false,");
    if (configPlan.sortOrder !== undefined) {
      lines.push(`      sortOrder: ${configPlan.sortOrder},`);
    }
    if (configPlan.defaultInterval) {
      lines.push(
        `      defaultInterval: ${quote(configPlan.defaultInterval)},`,
      );
    }

    if (configPlan.prices.length === 0) {
      lines.push("      prices: [],");
    } else {
      lines.push("      prices: [");
      for (const price of configPlan.prices) {
        const priceParts = [
          `interval: ${quote(price.interval)}`,
          `amountInCents: ${price.amountInCents}`,
        ];
        if (price.trialDays) priceParts.push(`trialDays: ${price.trialDays}`);
        lines.push(`        { ${priceParts.join(", ")} },`);
      }
      lines.push("      ],");
    }

    if (configPlan.features && Object.keys(configPlan.features).length > 0) {
      lines.push("      features: {");
      for (const [featureCode, featureValue] of Object.entries(
        configPlan.features,
      )) {
        if (typeof featureValue === "boolean") {
          lines.push(`        ${quote(featureCode)}: ${featureValue},`);
        } else {
          const parts: string[] = [];
          if (featureValue.included !== undefined) {
            parts.push(`included: ${featureValue.included}`);
          }
          if (featureValue.unlimited) parts.push("unlimited: true");
          if (featureValue.overage) {
            parts.push(
              `overage: { unitPrice: ${featureValue.overage.unitPrice} }`,
            );
          }
          if (parts.length > 0) {
            lines.push(
              `        ${quote(featureCode)}: { ${parts.join(", ")} },`,
            );
          } else {
            lines.push(`        ${quote(featureCode)}: {},`);
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
