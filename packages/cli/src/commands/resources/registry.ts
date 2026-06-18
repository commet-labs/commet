import type { ResourceDef } from "./factory";
import { parseBool, parseJson, parseNumber } from "./param-types";

const customersResource: ResourceDef = {
  name: "customers",
  description: "Manage customers",
  sdkProperty: "customers",
  actions: {
    create: {
      method: "create",
      description: "Create a customer",
      params: [
        {
          flag: "--email <email>",
          description: "Billing email (required)",
          required: true,
          sdkKey: "email",
        },
        { flag: "--id <id>", description: "Custom customer ID", sdkKey: "id" },
        {
          flag: "--full-name <name>",
          description: "Full name",
          sdkKey: "fullName",
        },
        { flag: "--domain <domain>", description: "Domain", sdkKey: "domain" },
        {
          flag: "--website <url>",
          description: "Website URL",
          sdkKey: "website",
        },
        {
          flag: "--timezone <tz>",
          description: "Timezone",
          sdkKey: "timezone",
        },
        {
          flag: "--language <lang>",
          description: "Language code",
          sdkKey: "language",
        },
        {
          flag: "--industry <industry>",
          description: "Industry",
          sdkKey: "industry",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
        {
          flag: "--address <json>",
          description:
            "Address (JSON: {line1, city, postalCode, country, ...})",
          parse: parseJson,
          sdkKey: "address",
        },
      ],
    },
    "create-batch": {
      method: "createBatch",
      description: "Create multiple customers in a batch",
      params: [
        {
          flag: "--customers <json>",
          description: "Array of customer objects (JSON)",
          required: true,
          parse: parseJson,
          sdkKey: "customers",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get a customer by ID",
      params: [
        {
          flag: "--id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a customer",
      params: [
        {
          flag: "--id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--email <email>",
          description: "Billing email",
          sdkKey: "email",
        },
        {
          flag: "--full-name <name>",
          description: "Full name",
          sdkKey: "fullName",
        },
        { flag: "--domain <domain>", description: "Domain", sdkKey: "domain" },
        {
          flag: "--website <url>",
          description: "Website URL",
          sdkKey: "website",
        },
        {
          flag: "--timezone <tz>",
          description: "Timezone",
          sdkKey: "timezone",
        },
        {
          flag: "--language <lang>",
          description: "Language code",
          sdkKey: "language",
        },
        {
          flag: "--industry <industry>",
          description: "Industry",
          sdkKey: "industry",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
        {
          flag: "--address <json>",
          description: "Address (JSON)",
          parse: parseJson,
          sdkKey: "address",
        },
      ],
    },
    list: {
      method: "list",
      description: "List customers",
      params: [
        {
          flag: "--search <query>",
          description: "Search query",
          sdkKey: "search",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
        {
          flag: "--start-date <date>",
          description: "Start date filter",
          sdkKey: "startDate",
        },
        {
          flag: "--end-date <date>",
          description: "End date filter",
          sdkKey: "endDate",
        },
      ],
    },
  },
};

const subscriptionsResource: ResourceDef = {
  name: "subscriptions",
  description: "Manage subscriptions",
  sdkProperty: "subscriptions",
  actions: {
    create: {
      method: "create",
      description: "Create a subscription",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID (required)",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--plan-code <code>",
          description: "Plan code (provide this or --plan-id)",
          sdkKey: "planCode",
        },
        {
          flag: "--plan-id <id>",
          description: "Plan ID (provide this or --plan-code)",
          sdkKey: "planId",
        },
        {
          flag: "--billing-interval <interval>",
          description:
            "Billing interval: weekly, monthly, quarterly, yearly, one_time",
          sdkKey: "billingInterval",
        },
        {
          flag: "--initial-seats <json>",
          description: "Initial seats map (JSON: {featureCode: count})",
          parse: parseJson,
          sdkKey: "initialSeats",
        },
        {
          flag: "--skip-trial <bool>",
          description: "Skip trial period",
          parse: parseBool,
          sdkKey: "skipTrial",
        },
        {
          flag: "--name <name>",
          description: "Subscription name",
          sdkKey: "name",
        },
        {
          flag: "--start-date <date>",
          description: "Start date (ISO 8601)",
          sdkKey: "startDate",
        },
        {
          flag: "--success-url <url>",
          description: "Redirect URL after successful checkout",
          sdkKey: "successUrl",
        },
      ],
      buildParams: (options: Record<string, string>) => {
        const params: Record<string, unknown> = {
          customerId: options.customerId,
        };
        if (options.planCode) params.planCode = options.planCode;
        if (options.planId) params.planId = options.planId;
        if (options.billingInterval)
          params.billingInterval = options.billingInterval;
        if (options.initialSeats)
          params.initialSeats = parseJson(options.initialSeats);
        if (options.skipTrial) params.skipTrial = parseBool(options.skipTrial);
        if (options.name) params.name = options.name;
        if (options.startDate) params.startDate = options.startDate;
        if (options.successUrl) params.successUrl = options.successUrl;
        return params;
      },
    },
    "get-active": {
      method: "getActive",
      description: "Get the active subscription for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
      ],
    },
    cancel: {
      method: "cancel",
      description: "Cancel a subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--reason <reason>",
          description: "Cancellation reason",
          sdkKey: "reason",
        },
        {
          flag: "--immediate <bool>",
          description: "Cancel immediately instead of at period end",
          parse: parseBool,
          sdkKey: "immediate",
        },
      ],
    },
    uncancel: {
      method: "uncancel",
      description: "Revert a pending cancellation",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    reactivate: {
      method: "reactivate",
      description:
        "Retry the outstanding renewal charge for a past_due subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "create-recovery-link": {
      method: "createRecoveryLink",
      description:
        "Generate a hosted recovery link for a past_due subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "update-payment-method": {
      method: "updatePaymentMethod",
      description:
        "Create a hosted checkout to update the subscription's payment method",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--success-url <url>",
          description: "Redirect URL after the payment method is updated",
          sdkKey: "successUrl",
        },
      ],
    },
    "change-plan": {
      method: "changePlan",
      description: "Change subscription plan",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--new-plan-id <id>",
          description: "New plan ID",
          sdkKey: "newPlanId",
        },
        {
          flag: "--new-billing-interval <interval>",
          description: "New billing interval",
          sdkKey: "newBillingInterval",
        },
      ],
    },
    list: {
      method: "list",
      description: "List subscriptions",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Filter by customer ID",
          sdkKey: "customerId",
        },
        {
          flag: "--status <status>",
          description: "Filter by status",
          sdkKey: "status",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    "preview-change": {
      method: "previewChange",
      description: "Preview plan change proration without applying",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--plan-id <planId>",
          description: "New plan ID",
          sdkKey: "planId",
        },
        {
          flag: "--billing-interval <interval>",
          description: "New billing interval",
          sdkKey: "billingInterval",
        },
      ],
    },
    "activate-addon": {
      method: "activateAddon",
      description: "Activate an addon on a subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--addon-id <addonId>",
          description: "Addon ID",
          required: true,
          sdkKey: "addonId",
        },
      ],
    },
    "deactivate-addon": {
      method: "deactivateAddon",
      description: "Deactivate an addon from a subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--addon-id <addonId>",
          description: "Addon ID",
          required: true,
          sdkKey: "addonId",
        },
      ],
    },
    "adjust-balance": {
      method: "adjustBalance",
      description: "Adjust subscription balance or credits",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--amount <amount>",
          description: "Amount (positive adds, negative subtracts)",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
        {
          flag: "--reason <reason>",
          description: "Reason for adjustment",
          sdkKey: "reason",
        },
        {
          flag: "--type <type>",
          description: "Adjustment type: balance or credits",
          sdkKey: "type",
        },
      ],
    },
    "topup-balance": {
      method: "topupBalance",
      description: "Top up subscription balance (charges payment method)",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--amount <amount>",
          description: "Amount to top up",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
      ],
    },
    "purchase-credits": {
      method: "purchaseCredits",
      description: "Purchase a credit pack for a subscription",
      params: [
        {
          flag: "--id <id>",
          description: "Subscription ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--credit-pack-id <creditPackId>",
          description: "Credit pack ID",
          required: true,
          sdkKey: "creditPackId",
        },
      ],
    },
  },
};

const plansResource: ResourceDef = {
  name: "plans",
  description: "Manage plans",
  sdkProperty: "plans",
  actions: {
    list: {
      method: "list",
      description: "List plans",
      params: [
        {
          flag: "--include-private <bool>",
          description: "Include private plans",
          parse: parseBool,
          sdkKey: "includePrivate",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get plan details",
      params: [
        {
          flag: "--id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create a plan",
      params: [
        {
          flag: "--name <name>",
          description: "Plan name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--code <code>",
          description: "Plan code",
          required: true,
          sdkKey: "code",
        },
        {
          flag: "--description <desc>",
          description: "Plan description",
          sdkKey: "description",
        },
        {
          flag: "--consumption-model <model>",
          description: "Consumption model: metered, credits, or balance",
          sdkKey: "consumptionModel",
        },
        {
          flag: "--is-public <bool>",
          description: "Whether plan is publicly visible",
          parse: parseBool,
          sdkKey: "isPublic",
        },
        {
          flag: "--is-free <bool>",
          description: "Whether plan is free",
          parse: parseBool,
          sdkKey: "isFree",
        },
        {
          flag: "--block-on-exhaustion <bool>",
          description: "Block usage when balance/credits exhausted",
          parse: parseBool,
          sdkKey: "blockOnExhaustion",
        },
        {
          flag: "--plan-group-id <id>",
          description: "Plan group ID",
          sdkKey: "planGroupId",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a plan",
      params: [
        {
          flag: "--id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--name <name>",
          description: "Plan name",
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Plan description",
          sdkKey: "description",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
        {
          flag: "--is-public <bool>",
          description: "Whether plan is publicly visible",
          parse: parseBool,
          sdkKey: "isPublic",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete a plan",
      params: [
        {
          flag: "--id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "set-visibility": {
      method: "setVisibility",
      description: "Set plan visibility",
      params: [
        {
          flag: "--id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--is-public <bool>",
          description: "Public visibility",
          required: true,
          parse: parseBool,
          sdkKey: "isPublic",
        },
      ],
    },
    "add-feature": {
      method: "addFeature",
      description: "Add a feature to a plan",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--feature-id <id>",
          description: "Feature ID",
          required: true,
          sdkKey: "featureId",
        },
        {
          flag: "--enabled <bool>",
          description: "Whether feature is enabled",
          parse: parseBool,
          sdkKey: "enabled",
        },
        {
          flag: "--included-amount <n>",
          description: "Included amount",
          parse: parseNumber,
          sdkKey: "includedAmount",
        },
        {
          flag: "--unlimited <bool>",
          description: "Whether usage is unlimited",
          parse: parseBool,
          sdkKey: "unlimited",
        },
        {
          flag: "--overage-enabled <bool>",
          description: "Whether overage is enabled",
          parse: parseBool,
          sdkKey: "overageEnabled",
        },
        {
          flag: "--overage-unit-price <n>",
          description: "Overage unit price (fixed pricing)",
          parse: parseNumber,
          sdkKey: "overageUnitPrice",
        },
        {
          flag: "--pricing-mode <mode>",
          description: "Pricing mode: fixed or ai_model",
          sdkKey: "pricingMode",
        },
        {
          flag: "--margin <n>",
          description: "Margin percentage (ai_model pricing)",
          parse: parseNumber,
          sdkKey: "margin",
        },
        {
          flag: "--credits-per-unit <n>",
          description: "Credits per unit",
          parse: parseNumber,
          sdkKey: "creditsPerUnit",
        },
      ],
    },
    "update-feature": {
      method: "updateFeature",
      description: "Update a feature on a plan",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--feature-id <id>",
          description: "Feature ID",
          required: true,
          sdkKey: "featureId",
        },
        {
          flag: "--enabled <bool>",
          description: "Whether feature is enabled",
          parse: parseBool,
          sdkKey: "enabled",
        },
        {
          flag: "--included-amount <n>",
          description: "Included amount",
          parse: parseNumber,
          sdkKey: "includedAmount",
        },
        {
          flag: "--unlimited <bool>",
          description: "Whether usage is unlimited",
          parse: parseBool,
          sdkKey: "unlimited",
        },
        {
          flag: "--overage-enabled <bool>",
          description: "Whether overage is enabled",
          parse: parseBool,
          sdkKey: "overageEnabled",
        },
        {
          flag: "--overage-unit-price <n>",
          description: "Overage unit price (fixed pricing)",
          parse: parseNumber,
          sdkKey: "overageUnitPrice",
        },
        {
          flag: "--pricing-mode <mode>",
          description: "Pricing mode: fixed or ai_model",
          sdkKey: "pricingMode",
        },
        {
          flag: "--margin <n>",
          description: "Margin percentage (ai_model pricing)",
          parse: parseNumber,
          sdkKey: "margin",
        },
        {
          flag: "--credits-per-unit <n>",
          description: "Credits per unit",
          parse: parseNumber,
          sdkKey: "creditsPerUnit",
        },
      ],
    },
    "remove-feature": {
      method: "removeFeature",
      description: "Remove a feature from a plan",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--feature-id <id>",
          description: "Feature ID",
          required: true,
          sdkKey: "featureId",
        },
      ],
    },
    "add-price": {
      method: "addPrice",
      description: "Add a price to a plan",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--billing-interval <interval>",
          description:
            "Billing interval: weekly, monthly, quarterly, yearly, one_time",
          required: true,
          sdkKey: "billingInterval",
        },
        {
          flag: "--price <n>",
          description: "Price in cents",
          required: true,
          parse: parseNumber,
          sdkKey: "price",
        },
        {
          flag: "--trial-days <n>",
          description: "Trial days",
          parse: parseNumber,
          sdkKey: "trialDays",
        },
        {
          flag: "--is-default <bool>",
          description: "Set as default price",
          parse: parseBool,
          sdkKey: "isDefault",
        },
        {
          flag: "--included-balance <n>",
          description: "Included balance",
          parse: parseNumber,
          sdkKey: "includedBalance",
        },
        {
          flag: "--included-credits <n>",
          description: "Included credits",
          parse: parseNumber,
          sdkKey: "includedCredits",
        },
        {
          flag: "--intro-offer-enabled <bool>",
          description: "Enable intro offer",
          parse: parseBool,
          sdkKey: "introOfferEnabled",
        },
        {
          flag: "--intro-offer-discount-type <type>",
          description: "Intro offer discount type: percentage or amount",
          sdkKey: "introOfferDiscountType",
        },
        {
          flag: "--intro-offer-discount-value <n>",
          description: "Intro offer discount value",
          parse: parseNumber,
          sdkKey: "introOfferDiscountValue",
        },
        {
          flag: "--intro-offer-duration-cycles <n>",
          description: "Intro offer duration in cycles",
          parse: parseNumber,
          sdkKey: "introOfferDurationCycles",
        },
      ],
    },
    "update-price": {
      method: "updatePrice",
      description: "Update a plan price",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--price-id <id>",
          description: "Price ID",
          required: true,
          sdkKey: "priceId",
        },
        {
          flag: "--price <n>",
          description: "Price in cents",
          parse: parseNumber,
          sdkKey: "price",
        },
        {
          flag: "--is-default <bool>",
          description: "Set as default price",
          parse: parseBool,
          sdkKey: "isDefault",
        },
        {
          flag: "--trial-days <n>",
          description: "Trial days",
          parse: parseNumber,
          sdkKey: "trialDays",
        },
        {
          flag: "--included-balance <n>",
          description: "Included balance",
          parse: parseNumber,
          sdkKey: "includedBalance",
        },
        {
          flag: "--included-credits <n>",
          description: "Included credits",
          parse: parseNumber,
          sdkKey: "includedCredits",
        },
        {
          flag: "--intro-offer-enabled <bool>",
          description: "Enable intro offer",
          parse: parseBool,
          sdkKey: "introOfferEnabled",
        },
        {
          flag: "--intro-offer-discount-type <type>",
          description: "Intro offer discount type: percentage or amount",
          sdkKey: "introOfferDiscountType",
        },
        {
          flag: "--intro-offer-discount-value <n>",
          description: "Intro offer discount value",
          parse: parseNumber,
          sdkKey: "introOfferDiscountValue",
        },
        {
          flag: "--intro-offer-duration-cycles <n>",
          description: "Intro offer duration in cycles",
          parse: parseNumber,
          sdkKey: "introOfferDurationCycles",
        },
      ],
    },
    "delete-price": {
      method: "deletePrice",
      description: "Delete a plan price",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--price-id <id>",
          description: "Price ID",
          required: true,
          sdkKey: "priceId",
        },
      ],
    },
    "set-default-price": {
      method: "setDefaultPrice",
      description: "Set a price as the default for a plan",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--price-id <id>",
          description: "Price ID",
          required: true,
          sdkKey: "priceId",
        },
      ],
    },
    "set-regional-prices": {
      method: "setRegionalPrices",
      description: "Set regional price overrides",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--price-id <id>",
          description: "Price ID",
          required: true,
          sdkKey: "priceId",
        },
        {
          flag: "--overrides <json>",
          description:
            'Regional overrides (JSON: [{currency: "EUR", price: 900}])',
          required: true,
          parse: parseJson,
          sdkKey: "overrides",
        },
      ],
    },
    "delete-regional-prices": {
      method: "deleteRegionalPrices",
      description: "Delete regional price overrides",
      params: [
        {
          flag: "--plan-id <id>",
          description: "Plan ID",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--price-id <id>",
          description: "Price ID",
          required: true,
          sdkKey: "priceId",
        },
      ],
    },
  },
};

const featuresResource: ResourceDef = {
  name: "features",
  description: "Manage the feature catalog",
  sdkProperty: "features",
  actions: {
    list: {
      method: "list",
      description: "List every feature in the organization catalog",
      params: [],
    },
    get: {
      method: "get",
      description: "Get a feature definition from the catalog by code",
      params: [
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create a feature",
      params: [
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
        {
          flag: "--name <name>",
          description: "Feature name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--type <type>",
          description: "Feature type: boolean, usage, or seats",
          required: true,
          sdkKey: "type",
        },
        {
          flag: "--description <desc>",
          description: "Feature description",
          sdkKey: "description",
        },
        {
          flag: "--unit-name <name>",
          description: "Unit name for metered features",
          sdkKey: "unitName",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a feature",
      params: [
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
        {
          flag: "--name <name>",
          description: "Feature name",
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Feature description",
          sdkKey: "description",
        },
        {
          flag: "--unit-name <name>",
          description: "Unit name",
          sdkKey: "unitName",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete a feature",
      params: [
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
      ],
    },
  },
};

const featureAccessResource: ResourceDef = {
  name: "feature-access",
  description: "Check a customer's feature access and usage",
  sdkProperty: "featureAccess",
  actions: {
    list: {
      method: "list",
      description: "List feature access for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get feature access details for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
      ],
    },
    "can-use": {
      method: "canUse",
      description: "Check if a customer can use one more unit of a feature",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "code",
        },
      ],
    },
  },
};

const seatsResource: ResourceDef = {
  name: "seats",
  description: "Manage seat allocations",
  sdkProperty: "seats",
  actions: {
    add: {
      method: "add",
      description: "Add seats for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--count <n>",
          description: "Number of seats to add (defaults to 1)",
          parse: parseNumber,
          sdkKey: "count",
        },
      ],
    },
    remove: {
      method: "remove",
      description: "Remove seats for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--count <n>",
          description: "Number of seats to remove (defaults to 1)",
          parse: parseNumber,
          sdkKey: "count",
        },
      ],
    },
    set: {
      method: "set",
      description: "Set exact seat count for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--count <n>",
          description: "Exact seat count",
          required: true,
          parse: parseNumber,
          sdkKey: "count",
        },
      ],
    },
    "set-all": {
      method: "setAll",
      description: "Set all seat counts for a customer at once",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--seats <json>",
          description: "Seats map (JSON: {featureCode: count})",
          required: true,
          parse: parseJson,
          sdkKey: "seats",
        },
      ],
    },
    "get-balance": {
      method: "getBalance",
      description: "Get seat balance for a specific feature",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
      ],
    },
    "get-all-balances": {
      method: "getAllBalances",
      description: "Get all seat balances for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
      ],
    },
  },
};

const usageResource: ResourceDef = {
  name: "usage",
  description: "Track usage events",
  sdkProperty: "usage",
  actions: {
    track: {
      method: "track",
      description: "Track a usage event",
      params: [
        {
          flag: "--feature <code>",
          description: "Feature code",
          required: true,
          sdkKey: "feature",
        },
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--value <n>",
          description: "Usage value (standard tracking)",
          parse: parseNumber,
          sdkKey: "value",
        },
        {
          flag: "--model <model>",
          description: "AI model name (model token tracking)",
          sdkKey: "model",
        },
        {
          flag: "--input-tokens <n>",
          description: "Input tokens (model tracking)",
          parse: parseNumber,
          sdkKey: "inputTokens",
        },
        {
          flag: "--output-tokens <n>",
          description: "Output tokens (model tracking)",
          parse: parseNumber,
          sdkKey: "outputTokens",
        },
        {
          flag: "--cache-read-tokens <n>",
          description: "Cache read tokens (model tracking)",
          parse: parseNumber,
          sdkKey: "cacheReadTokens",
        },
        {
          flag: "--cache-write-tokens <n>",
          description: "Cache write tokens (model tracking)",
          parse: parseNumber,
          sdkKey: "cacheWriteTokens",
        },
        {
          flag: "--idempotency-key <key>",
          description: "Idempotency key for deduplication",
          sdkKey: "idempotencyKey",
        },
        {
          flag: "--timestamp <ts>",
          description: "Event timestamp (ISO 8601)",
          sdkKey: "timestamp",
        },
        {
          flag: "--properties <json>",
          description: "Event properties (JSON: {key: value})",
          parse: parseJson,
          sdkKey: "properties",
        },
      ],
      buildParams: (options: Record<string, string>) => {
        const params: Record<string, unknown> = {
          feature: options.feature,
          customerId: options.customerId,
        };
        if (options.idempotencyKey)
          params.idempotencyKey = options.idempotencyKey;
        if (options.timestamp) params.timestamp = options.timestamp;
        if (options.properties)
          params.properties = parseJson(options.properties);

        if (options.model) {
          params.model = options.model;
          params.inputTokens = parseNumber(options.inputTokens);
          params.outputTokens = parseNumber(options.outputTokens);
          if (options.cacheReadTokens)
            params.cacheReadTokens = parseNumber(options.cacheReadTokens);
          if (options.cacheWriteTokens)
            params.cacheWriteTokens = parseNumber(options.cacheWriteTokens);
        } else {
          if (options.value) params.value = parseNumber(options.value);
        }

        return params;
      },
    },
    check: {
      method: "check",
      description: "Check if a usage event would be allowed",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--quantity <n>",
          description: "Quantity to check",
          required: true,
          parse: parseNumber,
          sdkKey: "quantity",
        },
      ],
    },
  },
};

const portalResource: ResourceDef = {
  name: "portal",
  description: "Customer portal access",
  sdkProperty: "portal",
  actions: {
    "get-url": {
      method: "getUrl",
      description: "Get a portal URL for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID (provide this or --email)",
          sdkKey: "customerId",
        },
        {
          flag: "--email <email>",
          description: "Customer email (provide this or --customer-id)",
          sdkKey: "email",
        },
      ],
      buildParams: (options: Record<string, string>) => {
        if (options.customerId) {
          return { customerId: options.customerId };
        }
        if (options.email) {
          return { email: options.email };
        }
        throw new Error("Either --customer-id or --email is required");
      },
    },
  },
};

const addonsResource: ResourceDef = {
  name: "addons",
  description: "Manage addons",
  sdkProperty: "addons",
  actions: {
    "list-active": {
      method: "listActive",
      description: "List active addons for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
      ],
    },
    list: {
      method: "list",
      description: "List all addons",
      params: [
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get addon details",
      params: [
        {
          flag: "--id <id>",
          description: "Addon ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create an addon",
      params: [
        {
          flag: "--name <name>",
          description: "Addon name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--base-price <n>",
          description: "Base price in cents",
          required: true,
          parse: parseNumber,
          sdkKey: "basePrice",
        },
        {
          flag: "--feature-id <id>",
          description: "Feature ID",
          required: true,
          sdkKey: "featureId",
        },
        {
          flag: "--consumption-model <model>",
          description:
            "Consumption model: boolean, metered, credits, or balance",
          required: true,
          sdkKey: "consumptionModel",
        },
        {
          flag: "--description <desc>",
          description: "Addon description",
          sdkKey: "description",
        },
        {
          flag: "--included-units <n>",
          description: "Included units (metered)",
          parse: parseNumber,
          sdkKey: "includedUnits",
        },
        {
          flag: "--overage-rate <n>",
          description: "Overage rate (metered/balance)",
          parse: parseNumber,
          sdkKey: "overageRate",
        },
        {
          flag: "--credit-cost <n>",
          description: "Credit cost (credits)",
          parse: parseNumber,
          sdkKey: "creditCost",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update an addon",
      params: [
        {
          flag: "--id <id>",
          description: "Addon ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--name <name>",
          description: "Addon name",
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Addon description",
          sdkKey: "description",
        },
        {
          flag: "--base-price <n>",
          description: "Base price in cents",
          parse: parseNumber,
          sdkKey: "basePrice",
        },
        {
          flag: "--included-units <n>",
          description: "Included units",
          parse: parseNumber,
          sdkKey: "includedUnits",
        },
        {
          flag: "--overage-rate <n>",
          description: "Overage rate",
          parse: parseNumber,
          sdkKey: "overageRate",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete an addon",
      params: [
        {
          flag: "--id <id>",
          description: "Addon ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const creditPacksResource: ResourceDef = {
  name: "credit-packs",
  description: "Manage credit packs",
  sdkProperty: "creditPacks",
  actions: {
    list: {
      method: "list",
      description: "List credit packs",
      params: [],
    },
    create: {
      method: "create",
      description: "Create a credit pack",
      params: [
        {
          flag: "--name <name>",
          description: "Credit pack name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--credits <n>",
          description: "Number of credits",
          required: true,
          parse: parseNumber,
          sdkKey: "credits",
        },
        {
          flag: "--price <n>",
          description: "Price in cents",
          required: true,
          parse: parseNumber,
          sdkKey: "price",
        },
        {
          flag: "--description <desc>",
          description: "Credit pack description",
          sdkKey: "description",
        },
        {
          flag: "--is-active <bool>",
          description: "Whether credit pack is active",
          parse: parseBool,
          sdkKey: "isActive",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a credit pack",
      params: [
        {
          flag: "--id <id>",
          description: "Credit pack ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--name <name>",
          description: "Credit pack name",
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Credit pack description",
          sdkKey: "description",
        },
        {
          flag: "--credits <n>",
          description: "Number of credits",
          parse: parseNumber,
          sdkKey: "credits",
        },
        {
          flag: "--price <n>",
          description: "Price in cents",
          parse: parseNumber,
          sdkKey: "price",
        },
        {
          flag: "--is-active <bool>",
          description: "Whether credit pack is active",
          parse: parseBool,
          sdkKey: "isActive",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete a credit pack",
      params: [
        {
          flag: "--id <id>",
          description: "Credit pack ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const webhooksResource: ResourceDef = {
  name: "webhooks",
  description: "Manage webhook endpoints",
  sdkProperty: "webhooks",
  actions: {
    list: {
      method: "list",
      description: "List webhook endpoints",
      params: [
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create a webhook endpoint",
      params: [
        {
          flag: "--url <url>",
          description: "Webhook URL",
          required: true,
          sdkKey: "url",
        },
        {
          flag: "--events <json>",
          description:
            'Events to subscribe to (JSON array: ["subscription.created"])',
          required: true,
          parse: parseJson,
          sdkKey: "events",
        },
        {
          flag: "--description <desc>",
          description: "Webhook description",
          sdkKey: "description",
        },
        {
          flag: "--api-version <version>",
          description: "Pin the endpoint to an API version",
          sdkKey: "apiVersion",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get a webhook endpoint",
      params: [
        {
          flag: "--id <id>",
          description: "Webhook endpoint ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a webhook endpoint",
      params: [
        {
          flag: "--id <id>",
          description: "Webhook endpoint ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--url <url>",
          description: "Webhook URL",
          sdkKey: "url",
        },
        {
          flag: "--events <json>",
          description:
            'Events to subscribe to (JSON array: ["subscription.created"])',
          parse: parseJson,
          sdkKey: "events",
        },
        {
          flag: "--description <desc>",
          description: "Webhook description",
          sdkKey: "description",
        },
        {
          flag: "--is-active <bool>",
          description: "Whether the endpoint is active",
          parse: parseBool,
          sdkKey: "isActive",
        },
        {
          flag: "--api-version <version>",
          description: "Pin the endpoint to an API version",
          sdkKey: "apiVersion",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete a webhook endpoint",
      params: [
        {
          flag: "--id <id>",
          description: "Webhook endpoint ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    test: {
      method: "test",
      description: "Send a test event to a webhook endpoint",
      params: [
        {
          flag: "--id <id>",
          description: "Webhook endpoint ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const apiKeysResource: ResourceDef = {
  name: "api-keys",
  description: "Manage API keys",
  sdkProperty: "apiKeys",
  actions: {
    list: {
      method: "list",
      description: "List API keys",
      params: [
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create an API key",
      params: [
        {
          flag: "--name <name>",
          description: "API key name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--expires-in-days <n>",
          description: "Expiration in days",
          parse: parseNumber,
          sdkKey: "expiresInDays",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete an API key",
      params: [
        {
          flag: "--id <id>",
          description: "API key ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const invoicesResource: ResourceDef = {
  name: "invoices",
  description: "Manage invoices",
  sdkProperty: "invoices",
  actions: {
    list: {
      method: "list",
      description: "List invoices",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Filter by customer ID",
          sdkKey: "customerId",
        },
        {
          flag: "--status <status>",
          description: "Filter by status",
          sdkKey: "status",
        },
        {
          flag: "--subscription-id <id>",
          description: "Filter by subscription ID",
          sdkKey: "subscriptionId",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get invoice details",
      params: [
        {
          flag: "--id <id>",
          description: "Invoice ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "create-adjustment": {
      method: "createAdjustment",
      description: "Create an adjustment invoice (negative amount = credit)",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--amount <n>",
          description: "Amount in cents (negative for credit)",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
        {
          flag: "--description <desc>",
          description: "Adjustment description",
          sdkKey: "description",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
      ],
    },
    "get-download-url": {
      method: "getDownloadUrl",
      description: "Get a signed download URL for an invoice PDF",
      params: [
        {
          flag: "--id <id>",
          description: "Invoice ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    send: {
      method: "send",
      description: "Send an invoice by email",
      params: [
        {
          flag: "--id <id>",
          description: "Invoice ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "update-status": {
      method: "updateStatus",
      description: "Update invoice status (outstanding invoices only)",
      params: [
        {
          flag: "--id <id>",
          description: "Invoice ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--status <status>",
          description: "New status (paid or void)",
          required: true,
          sdkKey: "status",
        },
      ],
    },
  },
};

const transactionsResource: ResourceDef = {
  name: "transactions",
  description: "Manage transactions",
  sdkProperty: "transactions",
  actions: {
    list: {
      method: "list",
      description: "List transactions",
      params: [
        {
          flag: "--status <status>",
          description: "Filter by status",
          sdkKey: "status",
        },
        {
          flag: "--customer-email <email>",
          description: "Filter by customer email",
          sdkKey: "customerEmail",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get transaction details",
      params: [
        {
          flag: "--id <id>",
          description: "Transaction ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    refund: {
      method: "refund",
      description: "Refund a transaction (full refund)",
      params: [
        {
          flag: "--id <id>",
          description: "Transaction ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    retry: {
      method: "retry",
      description: "Retry a failed transaction",
      params: [
        {
          flag: "--id <id>",
          description: "Transaction ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const promoCodesResource: ResourceDef = {
  name: "promo-codes",
  description: "Manage promo codes",
  sdkProperty: "promoCodes",
  actions: {
    list: {
      method: "list",
      description: "List promo codes",
      params: [
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get promo code details",
      params: [
        {
          flag: "--id <id>",
          description: "Promo code ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create a promo code",
      params: [
        {
          flag: "--code <code>",
          description: "Promo code string",
          required: true,
          sdkKey: "code",
        },
        {
          flag: "--discount-type <type>",
          description: "Discount type: percentage or amount",
          required: true,
          sdkKey: "discountType",
        },
        {
          flag: "--discount-value <n>",
          description: "Discount value",
          required: true,
          parse: parseNumber,
          sdkKey: "discountValue",
        },
        {
          flag: "--duration-cycles <n>",
          description: "Duration in billing cycles",
          parse: parseNumber,
          sdkKey: "durationCycles",
        },
        {
          flag: "--max-redemptions <n>",
          description: "Maximum number of redemptions",
          parse: parseNumber,
          sdkKey: "maxRedemptions",
        },
        {
          flag: "--expires-at <date>",
          description: "Expiration date (ISO 8601)",
          sdkKey: "expiresAt",
        },
        {
          flag: "--plan-ids <json>",
          description: "Restrict to plan IDs (JSON array)",
          parse: parseJson,
          sdkKey: "planIds",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a promo code",
      params: [
        {
          flag: "--id <id>",
          description: "Promo code ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--max-redemptions <n>",
          description: "Maximum number of redemptions",
          parse: parseNumber,
          sdkKey: "maxRedemptions",
        },
        {
          flag: "--expires-at <date>",
          description: "Expiration date (ISO 8601)",
          sdkKey: "expiresAt",
        },
        {
          flag: "--active <bool>",
          description: "Whether promo code is active",
          parse: parseBool,
          sdkKey: "active",
        },
        {
          flag: "--plan-ids <json>",
          description: "Restrict to plan IDs (JSON array)",
          parse: parseJson,
          sdkKey: "planIds",
        },
      ],
    },
  },
};

const planGroupsResource: ResourceDef = {
  name: "plan-groups",
  description: "Manage plan groups",
  sdkProperty: "planGroups",
  actions: {
    list: {
      method: "list",
      description: "List plan groups",
      params: [
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get plan group details",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    create: {
      method: "create",
      description: "Create a plan group",
      params: [
        {
          flag: "--name <name>",
          description: "Plan group name",
          required: true,
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Plan group description",
          sdkKey: "description",
        },
        {
          flag: "--is-public <bool>",
          description: "Whether plan group is publicly visible",
          parse: parseBool,
          sdkKey: "isPublic",
        },
      ],
    },
    update: {
      method: "update",
      description: "Update a plan group",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--name <name>",
          description: "Plan group name",
          sdkKey: "name",
        },
        {
          flag: "--description <desc>",
          description: "Plan group description",
          sdkKey: "description",
        },
        {
          flag: "--is-public <bool>",
          description: "Whether plan group is publicly visible",
          parse: parseBool,
          sdkKey: "isPublic",
        },
      ],
    },
    delete: {
      method: "delete",
      description: "Delete a plan group",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    "add-plan": {
      method: "addPlan",
      description: "Add a plan to a group",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--plan-id <planId>",
          description: "Plan ID to add",
          required: true,
          sdkKey: "planId",
        },
        {
          flag: "--sort-order <n>",
          description: "Sort order",
          parse: parseNumber,
          sdkKey: "sortOrder",
        },
      ],
    },
    "remove-plan": {
      method: "removePlan",
      description: "Remove a plan from a group",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--plan-id <planId>",
          description: "Plan ID to remove",
          required: true,
          sdkKey: "planId",
        },
      ],
    },
    "reorder-plans": {
      method: "reorderPlans",
      description: "Reorder plans within a group",
      params: [
        {
          flag: "--id <id>",
          description: "Plan group ID",
          required: true,
          sdkKey: "id",
        },
        {
          flag: "--plan-ids <json>",
          description: "Ordered plan IDs (JSON array)",
          required: true,
          parse: parseJson,
          sdkKey: "planIds",
        },
      ],
    },
  },
};

const paymentsResource: ResourceDef = {
  name: "payments",
  description: "Manage one-time payments and payment links",
  sdkProperty: "payments",
  actions: {
    create: {
      method: "create",
      description:
        "Create a hosted payment link the customer opens to pay with any card",
      params: [
        {
          flag: "--amount <n>",
          description: "Amount in cents",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
        {
          flag: "--currency <currency>",
          description: "Currency code (e.g. USD)",
          required: true,
          sdkKey: "currency",
        },
        {
          flag: "--description <desc>",
          description: "Payment description",
          required: true,
          sdkKey: "description",
        },
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          sdkKey: "customerId",
        },
        {
          flag: "--success-url <url>",
          description: "Redirect URL after successful payment",
          sdkKey: "successUrl",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
      ],
    },
    charge: {
      method: "charge",
      description: "Charge a customer's vaulted payment method off-session",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--amount <n>",
          description: "Amount in cents",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
        {
          flag: "--currency <currency>",
          description: "Currency code (e.g. USD)",
          required: true,
          sdkKey: "currency",
        },
        {
          flag: "--description <desc>",
          description: "Payment description",
          required: true,
          sdkKey: "description",
        },
        {
          flag: "--metadata <json>",
          description: "Metadata (JSON)",
          parse: parseJson,
          sdkKey: "metadata",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get a payment by ID",
      params: [
        {
          flag: "--id <id>",
          description: "Payment ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
    list: {
      method: "list",
      description: "List payments",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Filter by customer ID",
          sdkKey: "customerId",
        },
        {
          flag: "--limit <n>",
          description: "Max results",
          parse: parseNumber,
          sdkKey: "limit",
        },
        {
          flag: "--cursor <cursor>",
          description: "Pagination cursor",
          sdkKey: "cursor",
        },
      ],
    },
    cancel: {
      method: "cancel",
      description: "Cancel a pending payment link",
      params: [
        {
          flag: "--id <id>",
          description: "Payment ID",
          required: true,
          sdkKey: "id",
        },
      ],
    },
  },
};

const payoutsResource: ResourceDef = {
  name: "payouts",
  description: "Manage payouts",
  sdkProperty: "payouts",
  actions: {
    request: {
      method: "request",
      description: "Request a payout of available balance",
      params: [
        {
          flag: "--amount <n>",
          description: "Amount in cents (USD, minimum 1000)",
          required: true,
          parse: parseNumber,
          sdkKey: "amount",
        },
        {
          flag: "--description <desc>",
          description: "Payout description",
          sdkKey: "description",
        },
      ],
    },
    "add-bank-account": {
      method: "addBankAccount",
      description: "Add a destination bank account to the payout account",
      params: [
        {
          flag: "--account-number <number>",
          description: "Bank account number",
          required: true,
          sdkKey: "accountNumber",
        },
        {
          flag: "--account-holder-name <name>",
          description: "Account holder name",
          required: true,
          sdkKey: "accountHolderName",
        },
        {
          flag: "--routing-number <number>",
          description: "Routing number",
          sdkKey: "routingNumber",
        },
        {
          flag: "--account-type <type>",
          description: "Account type: checking or savings",
          sdkKey: "accountType",
        },
        {
          flag: "--set-default <bool>",
          description: "Set as default bank account",
          parse: parseBool,
          sdkKey: "setDefault",
        },
      ],
    },
    "complete-verification": {
      method: "completeVerification",
      description: "Provision the payout account with the full KYC payload",
      params: [
        {
          flag: "--email <email>",
          description: "Contact email",
          required: true,
          sdkKey: "email",
        },
        {
          flag: "--business-type <type>",
          description: "Business type: individual or company",
          required: true,
          sdkKey: "businessType",
        },
        {
          flag: "--business-url <url>",
          description: "Business website URL",
          required: true,
          sdkKey: "businessUrl",
        },
        {
          flag: "--document-url <url>",
          description: "Identity document URL",
          required: true,
          sdkKey: "documentUrl",
        },
        {
          flag: "--bank <json>",
          description:
            "Bank account (JSON: {accountNumber, accountHolderName, ...})",
          required: true,
          parse: parseJson,
          sdkKey: "bank",
        },
        {
          flag: "--individual <json>",
          description: "Individual KYC details (JSON, individual businesses)",
          parse: parseJson,
          sdkKey: "individual",
        },
        {
          flag: "--company <json>",
          description: "Company KYC details (JSON, company businesses)",
          parse: parseJson,
          sdkKey: "company",
        },
      ],
    },
  },
};

const testClockResource: ResourceDef = {
  name: "test-clock",
  description: "Control the sandbox test clock",
  sdkProperty: "testClock",
  actions: {
    get: {
      method: "get",
      description: "Get the current test clock state (sandbox only)",
      params: [],
    },
    advance: {
      method: "advance",
      description: "Move the test clock forward (sandbox only)",
      params: [
        {
          flag: "--advance-days <n>",
          description: "Days to move the clock forward",
          parse: parseNumber,
          sdkKey: "advanceDays",
        },
        {
          flag: "--frozen-time <ts>",
          description: "Absolute instant to move to (ISO 8601)",
          sdkKey: "frozenTime",
        },
      ],
    },
    "process-billing": {
      method: "processBilling",
      description:
        "Enqueue billing cycles for customers due at the simulated time (sandbox only)",
      params: [],
    },
  },
};

const quotaResource: ResourceDef = {
  name: "quota",
  description: "Manage quota allowances",
  sdkProperty: "quota",
  actions: {
    add: {
      method: "add",
      description: "Add to a customer's quota allowance for a feature",
      params: [
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--customer-id <id>",
          description: "Customer ID (provide this or --external-id)",
          sdkKey: "customerId",
        },
        {
          flag: "--external-id <id>",
          description: "Customer external ID (provide this or --customer-id)",
          sdkKey: "externalId",
        },
        {
          flag: "--count <n>",
          description: "Amount to add (defaults to 1)",
          parse: parseNumber,
          sdkKey: "count",
        },
        {
          flag: "--idempotency-key <key>",
          description: "Idempotency key for deduplication",
          sdkKey: "idempotencyKey",
        },
      ],
    },
    set: {
      method: "set",
      description: "Set a customer's quota allowance to an exact value",
      params: [
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--count <n>",
          description: "Exact allowance value",
          required: true,
          parse: parseNumber,
          sdkKey: "count",
        },
        {
          flag: "--customer-id <id>",
          description: "Customer ID (provide this or --external-id)",
          sdkKey: "customerId",
        },
        {
          flag: "--external-id <id>",
          description: "Customer external ID (provide this or --customer-id)",
          sdkKey: "externalId",
        },
        {
          flag: "--idempotency-key <key>",
          description: "Idempotency key for deduplication",
          sdkKey: "idempotencyKey",
        },
      ],
    },
    remove: {
      method: "remove",
      description: "Remove from a customer's quota allowance for a feature",
      params: [
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
        {
          flag: "--customer-id <id>",
          description: "Customer ID (provide this or --external-id)",
          sdkKey: "customerId",
        },
        {
          flag: "--external-id <id>",
          description: "Customer external ID (provide this or --customer-id)",
          sdkKey: "externalId",
        },
        {
          flag: "--count <n>",
          description: "Amount to remove (defaults to 1)",
          parse: parseNumber,
          sdkKey: "count",
        },
        {
          flag: "--idempotency-key <key>",
          description: "Idempotency key for deduplication",
          sdkKey: "idempotencyKey",
        },
      ],
    },
    get: {
      method: "get",
      description: "Get the quota allowance for a specific feature",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
        {
          flag: "--feature-code <code>",
          description: "Feature code",
          required: true,
          sdkKey: "featureCode",
        },
      ],
    },
    "get-all": {
      method: "getAll",
      description: "Get all quota allowances for a customer",
      params: [
        {
          flag: "--customer-id <id>",
          description: "Customer ID",
          required: true,
          sdkKey: "customerId",
        },
      ],
    },
  },
};

export const resourceDefinitions: ResourceDef[] = [
  customersResource,
  subscriptionsResource,
  plansResource,
  featuresResource,
  featureAccessResource,
  seatsResource,
  usageResource,
  portalResource,
  addonsResource,
  creditPacksResource,
  webhooksResource,
  apiKeysResource,
  invoicesResource,
  transactionsResource,
  promoCodesResource,
  planGroupsResource,
  paymentsResource,
  payoutsResource,
  testClockResource,
  quotaResource,
];
