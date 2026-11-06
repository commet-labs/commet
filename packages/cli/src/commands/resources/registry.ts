import type { ResourceDef } from "./factory";
import {
  parseBool,
  parseJson,
  parseNullableNumber,
  parseNumber,
} from "./param-types";

export const resourceDefinitions: ResourceDef[] = [
  {
    name: "addons",
    description: "Manage addons",
    sdkProperty: "addons",
    actions: {
      "list-active": {
        method: "listActive",
        description: "List all active add-ons for a customer's subscription.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
      get: {
        method: "get",
        description: "Retrieve an add-on by its public ID or slug.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description:
          "Update an add-on's name, description, pricing, or the plans that sell it.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--base-price <number>",
            description: "Base price",
            parse: parseNumber,
            sdkKey: "basePrice",
          },
          {
            flag: "--included-units <number>",
            description: "Included units",
            parse: parseNumber,
            sdkKey: "includedUnits",
          },
          {
            flag: "--overage-rate <number>",
            description: "Overage rate",
            parse: parseNumber,
            sdkKey: "overageRate",
          },
          {
            flag: "--plan-ids <json>",
            description:
              "Plans that sell the add-on, replacing the current ones.",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Soft-delete an add-on.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List all add-ons with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a new add-on linked to a feature.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--base-price <number>",
            description: "Base price",
            required: true,
            parse: parseNumber,
            sdkKey: "basePrice",
          },
          {
            flag: "--feature-id <feature-id>",
            description: "Feature id",
            required: true,
            sdkKey: "featureId",
          },
          {
            flag: "--plan-ids <json>",
            description: "Plans that sell the add-on.",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--consumption-model <consumption-model>",
            description: "Consumption model",
            required: true,
            sdkKey: "consumptionModel",
          },
          {
            flag: "--included-units <number>",
            description: "Included units",
            parse: parseNumber,
            sdkKey: "includedUnits",
          },
          {
            flag: "--overage-rate <number>",
            description: "Overage rate",
            parse: parseNumber,
            sdkKey: "overageRate",
          },
          {
            flag: "--credit-cost <number>",
            description: "Credit cost",
            parse: parseNumber,
            sdkKey: "creditCost",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["name", "basePrice", "featureId", "consumptionModel"],
          [
            "name",
            "basePrice",
            "featureId",
            "consumptionModel",
            "includedUnits",
            "overageRate",
          ],
          ["name", "basePrice", "featureId", "consumptionModel", "creditCost"],
          ["name", "basePrice", "featureId", "consumptionModel", "overageRate"],
        ],
      },
    },
  },
  {
    name: "api-keys",
    description: "Manage api keys",
    sdkProperty: "apiKeys",
    actions: {
      delete: {
        method: "delete",
        description: "Permanently revoke and delete an API key.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List API keys with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a full-access or restricted API key.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--expires-in-days <number>",
            description: "Expires in days",
            parse: parseNumber,
            sdkKey: "expiresInDays",
          },
          {
            flag: "--permissions <json>",
            description: "Permissions",
            parse: parseJson,
            sdkKey: "permissions",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "provisioning",
    description: "Manage provisioning",
    sdkProperty: "provisioning",
    actions: {
      "create-claim-link": {
        method: "createClaimLink",
        description:
          "Issue a fresh claim link for an organization that was provisioned headlessly and has not been claimed yet.",
        hasParams: false,
        params: [
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "credit-packs",
    description: "Manage credit packs",
    sdkProperty: "creditPacks",
    actions: {
      update: {
        method: "update",
        description:
          "Update a credit pack's name, description, credits, price, active status, or the plans that sell it.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--credits <number>",
            description: "Credits",
            parse: parseNumber,
            sdkKey: "credits",
          },
          {
            flag: "--price <number>",
            description: "Price",
            parse: parseNumber,
            sdkKey: "price",
          },
          {
            flag: "--is-active <boolean>",
            description: "Is active",
            parse: parseBool,
            sdkKey: "isActive",
          },
          {
            flag: "--plan-ids <json>",
            description:
              "Plans that sell the credit pack, replacing the current ones.",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Soft-delete a credit pack.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List all active credit packs.",
        hasParams: false,
        params: [],
      },
      create: {
        method: "create",
        description: "Create a new credit pack.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--credits <number>",
            description: "Credits",
            required: true,
            parse: parseNumber,
            sdkKey: "credits",
          },
          {
            flag: "--price <number>",
            description: "Price",
            required: true,
            parse: parseNumber,
            sdkKey: "price",
          },
          {
            flag: "--is-active <boolean>",
            description: "Is active",
            parse: parseBool,
            sdkKey: "isActive",
          },
          {
            flag: "--plan-ids <json>",
            description: "Plans that sell the credit pack.",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "customers",
    description: "Manage customers",
    sdkProperty: "customers",
    actions: {
      "revoke-credit": {
        method: "revokeCredit",
        description:
          "Revoke the unallocated remainder of a customer credit grant.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--credit-id <credit-id>",
            description: "Credit id",
            required: true,
            sdkKey: "creditId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "list-credits": {
        method: "listCredits",
        description:
          "List currency-specific invoice credit grants and their remaining balances for a customer.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "create-credit": {
        method: "createCredit",
        description: "Grant monetary credit in one currency.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--amount <number>",
            description: "Amount in the currency's smallest unit.",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--currency <currency>",
            description: "Currency",
            required: true,
            sdkKey: "currency",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            required: true,
            sdkKey: "reason",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "revoke-plan-grant": {
        method: "revokePlanGrant",
        description:
          "End expanded access immediately and restore the base plan's limits.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--grant-id <grant-id>",
            description: "Grant id",
            required: true,
            sdkKey: "grantId",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            required: true,
            sdkKey: "reason",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "update-plan-grant": {
        method: "updatePlanGrant",
        description:
          "Keep the overlay for a number of the subscription's existing billing cycles, set an exact deadline, or leave it active until revoked.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--grant-id <grant-id>",
            description: "Grant id",
            required: true,
            sdkKey: "grantId",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            required: true,
            sdkKey: "reason",
          },
          {
            flag: "--duration <duration>",
            description: "Duration",
            required: true,
            sdkKey: "duration",
          },
          {
            flag: "--duration-cycles <number>",
            description: "Duration cycles",
            parse: parseNumber,
            sdkKey: "durationCycles",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["reason", "duration", "durationCycles"],
          ["reason", "duration", "expiresAt"],
          ["reason", "duration"],
        ],
      },
      "list-plan-grants": {
        method: "listPlanGrants",
        description:
          "List the independent audit timeline for paid-plan access granted without checkout or payment credentials.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "create-plan-grant": {
        method: "createPlanGrant",
        description:
          "Temporarily expand an active subscription's feature access using a higher plan in the same plan group.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--subscription-id <subscription-id>",
            description: "Subscription id",
            required: true,
            sdkKey: "subscriptionId",
          },
          {
            flag: "--plan-id <plan-id>",
            description: "Plan id",
            required: true,
            sdkKey: "planId",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            required: true,
            sdkKey: "reason",
          },
          {
            flag: "--duration <duration>",
            description: "Duration",
            required: true,
            sdkKey: "duration",
          },
          {
            flag: "--duration-cycles <number>",
            description: "Duration cycles",
            parse: parseNumber,
            sdkKey: "durationCycles",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["subscriptionId", "planId", "reason", "duration", "durationCycles"],
          ["subscriptionId", "planId", "reason", "duration", "expiresAt"],
          ["subscriptionId", "planId", "reason", "duration"],
        ],
      },
      get: {
        method: "get",
        description:
          "Retrieve a customer by their public ID, including subscription status and metadata.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description: "Update a customer's name, external ID, or metadata.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--email <email>", description: "Email", sdkKey: "email" },
          {
            flag: "--full-name <full-name>",
            description: "Full name",
            sdkKey: "fullName",
          },
          {
            flag: "--tax-document <tax-document>",
            description: "Tax document",
            sdkKey: "taxDocument",
          },
          {
            flag: "--business-tax-id <business-tax-id>",
            description:
              "Business tax ID, such as an EU VAT number or a Peruvian RUC, for the country of the customer's address.",
            sdkKey: "businessTaxId",
          },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
          {
            flag: "--timezone <timezone>",
            description: "Timezone",
            sdkKey: "timezone",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--address <json>",
            description: "Address",
            parse: parseJson,
            sdkKey: "address",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "create-batch": {
        method: "createBatch",
        description: "Create up to 100 customers in a single request.",
        hasParams: true,
        params: [
          {
            flag: "--customers <json>",
            description: "Customers",
            required: true,
            parse: parseJson,
            sdkKey: "customers",
          },
          {
            flag: "--plan-group-id <plan-group-id>",
            description:
              "Plan group whose starting plan the customer starts on when it has no open subscription: its signup trial, a trial without a payment method, when the group has one and the customer never had that plan, otherwise its default plan.",
            sdkKey: "planGroupId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description: "List customers with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a new customer.",
        hasParams: true,
        params: [
          { flag: "--id <id>", description: "Id", sdkKey: "id" },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
          {
            flag: "--full-name <full-name>",
            description: "Full name",
            sdkKey: "fullName",
          },
          {
            flag: "--tax-document <tax-document>",
            description: "Tax document",
            sdkKey: "taxDocument",
          },
          {
            flag: "--business-tax-id <business-tax-id>",
            description:
              "Business tax ID, such as an EU VAT number or a Peruvian RUC, for the country of the customer's address.",
            sdkKey: "businessTaxId",
          },
          {
            flag: "--address <json>",
            description: "Address",
            parse: parseJson,
            sdkKey: "address",
          },
          {
            flag: "--address-id <address-id>",
            description: "Address id",
            sdkKey: "addressId",
          },
          {
            flag: "--email <email>",
            description: "Email",
            required: true,
            sdkKey: "email",
          },
          {
            flag: "--timezone <timezone>",
            description: "Timezone",
            sdkKey: "timezone",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--plan-group-id <plan-group-id>",
            description:
              "Plan group whose starting plan the customer starts on when it has no open subscription: its signup trial, a trial without a payment method, when the group has one and the customer never had that plan, otherwise its default plan.",
            sdkKey: "planGroupId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "feature-access",
    description: "Manage feature access",
    sdkProperty: "featureAccess",
    actions: {
      get: {
        method: "get",
        description:
          "Get one feature's access and current usage for a customer.",
        hasParams: true,
        params: [
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
      list: {
        method: "list",
        description: "List a customer's feature access and current usage.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
    },
  },
  {
    name: "features",
    description: "Manage features",
    sdkProperty: "features",
    actions: {
      get: {
        method: "get",
        description:
          "Get a single feature definition by code from the organization's feature catalog.",
        hasParams: true,
        params: [
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
        ],
      },
      update: {
        method: "update",
        description: "Update a feature's name, description, or unit name.",
        hasParams: true,
        params: [
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--unit-name <unit-name>",
            description: "Unit name",
            sdkKey: "unitName",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Delete a feature.",
        hasParams: true,
        params: [
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
        ],
      },
      list: {
        method: "list",
        description: "List every feature defined in the organization.",
        hasParams: false,
        params: [],
      },
      create: {
        method: "create",
        description: "Create a new feature.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--type <type>",
            description: "Type",
            required: true,
            sdkKey: "type",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--unit-name <unit-name>",
            description: "Unit name",
            sdkKey: "unitName",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "invoices",
    description: "Manage invoices",
    sdkProperty: "invoices",
    actions: {
      "get-download-url": {
        method: "getDownloadUrl",
        description: "Generate a signed URL to download the invoice as a PDF.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Retrieve a single invoice by its public ID, including line items.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      send: {
        method: "send",
        description: "Send the invoice to the customer via email.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "update-status": {
        method: "updateStatus",
        description:
          'Mark an outstanding invoice as "paid" or "void" and return the updated invoice.',
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--status <status>",
            description: "Status",
            required: true,
            sdkKey: "status",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description: "List invoices with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--status <status>",
            description: "Status",
            sdkKey: "status",
          },
          {
            flag: "--subscription-id <subscription-id>",
            description: "Subscription id",
            sdkKey: "subscriptionId",
          },
        ],
      },
      "create-adjustment": {
        method: "createAdjustment",
        description:
          "Create a one-off adjustment invoice and return the created invoice.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--amount <number>",
            description: "Amount",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--description <description>",
            description: "Description",
            required: true,
            sdkKey: "description",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "markets",
    description: "Manage markets",
    sdkProperty: "markets",
    actions: {
      get: {
        method: "get",
        description: "Get one reusable market.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description: "Replace the name, countries, and metadata of a market.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--country-codes <json>",
            description: "Country codes",
            required: true,
            parse: parseJson,
            sdkKey: "countryCodes",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Delete an unused market.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description:
          "List reusable country groups that resolve market-specific prices independently from currency.",
        hasParams: false,
        params: [],
      },
      create: {
        method: "create",
        description:
          "Create a reusable market without attaching it to a plan or price.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--country-codes <json>",
            description: "Country codes",
            required: true,
            parse: parseJson,
            sdkKey: "countryCodes",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "offers",
    description: "Manage offers",
    sdkProperty: "offers",
    actions: {
      get: {
        method: "get",
        description: "Retrieve reusable offer terms by public ID.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description: "Replace reusable offer terms.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--phases <json>",
            description: "Phases",
            required: true,
            parse: parseJson,
            sdkKey: "phases",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--starts-at <starts-at>",
            description: "Starts at",
            sdkKey: "startsAt",
          },
          {
            flag: "--ends-at <ends-at>",
            description: "Ends at",
            sdkKey: "endsAt",
          },
          {
            flag: "--active <boolean>",
            description: "Active",
            parse: parseBool,
            sdkKey: "active",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Soft-delete an Offer.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List reusable offer terms.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
          {
            flag: "--active <boolean>",
            description: "Active",
            parse: parseBool,
            sdkKey: "active",
          },
        ],
      },
      create: {
        method: "create",
        description:
          "Create reusable offer terms without assigning a plan, price, eligibility rule, or distribution channel.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--phases <json>",
            description: "Phases",
            required: true,
            parse: parseJson,
            sdkKey: "phases",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--starts-at <starts-at>",
            description: "Starts at",
            sdkKey: "startsAt",
          },
          {
            flag: "--ends-at <ends-at>",
            description: "Ends at",
            sdkKey: "endsAt",
          },
          {
            flag: "--active <boolean>",
            description: "Active",
            parse: parseBool,
            sdkKey: "active",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "payments",
    description: "Manage payments",
    sdkProperty: "payments",
    actions: {
      cancel: {
        method: "cancel",
        description:
          "Cancel a pending payment link so it can no longer be paid.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description: "Retrieve a payment by its public ID.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      charge: {
        method: "charge",
        description: "Charge a customer's vaulted payment method off-session.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--amount <number>",
            description: "Amount",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--currency <currency>",
            description: "Currency",
            required: true,
            sdkKey: "currency",
          },
          {
            flag: "--description <description>",
            description: "Description",
            required: true,
            sdkKey: "description",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description: "List payments with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a hosted payment link.",
        hasParams: true,
        params: [
          {
            flag: "--amount <number>",
            description: "Amount",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--currency <currency>",
            description: "Currency",
            required: true,
            sdkKey: "currency",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--description <description>",
            description: "Description",
            required: true,
            sdkKey: "description",
          },
          {
            flag: "--success-url <success-url>",
            description: "Success url",
            sdkKey: "successUrl",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "payouts",
    description: "Manage payouts",
    sdkProperty: "payouts",
    actions: {
      "add-bank-account": {
        method: "addBankAccount",
        description:
          "Add an additional destination bank account to the organization's existing payout account.",
        hasParams: true,
        params: [
          {
            flag: "--account-number <account-number>",
            description: "Account number",
            required: true,
            sdkKey: "accountNumber",
          },
          {
            flag: "--account-holder-name <account-holder-name>",
            description: "Account holder name",
            required: true,
            sdkKey: "accountHolderName",
          },
          {
            flag: "--routing-number <routing-number>",
            description: "Routing number",
            sdkKey: "routingNumber",
          },
          {
            flag: "--account-type <account-type>",
            description: "Account type",
            sdkKey: "accountType",
          },
          {
            flag: "--set-default <boolean>",
            description: "Set default",
            parse: parseBool,
            sdkKey: "setDefault",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      request: {
        method: "request",
        description:
          "Withdraw available balance to the organization's verified payout account.",
        hasParams: true,
        params: [
          {
            flag: "--amount <number>",
            description: "Amount",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "complete-verification": {
        method: "completeVerification",
        description: "Deprecated.",
        hasParams: false,
        params: [
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "plan-groups",
    description: "Manage plan groups",
    sdkProperty: "planGroups",
    actions: {
      "remove-plan": {
        method: "removePlan",
        description: "Remove a plan from a plan group.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--plan-id <plan-id>",
            description: "Plan id",
            required: true,
            sdkKey: "planId",
          },
        ],
      },
      "reorder-plans": {
        method: "reorderPlans",
        description: "Set the display order of plans within a group.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--plan-ids <json>",
            description: "Plan ids",
            required: true,
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "add-plan": {
        method: "addPlan",
        description:
          "Add an existing plan to a plan group with optional sort order.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--plan-id <plan-id>",
            description: "Plan id",
            required: true,
            sdkKey: "planId",
          },
          {
            flag: "--sort-order <number>",
            description: "Sort order",
            parse: parseNumber,
            sdkKey: "sortOrder",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Retrieve a plan group by ID, including its plans ordered by sortOrder.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description: "Update a plan group's name, description, or visibility.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--is-public <boolean>",
            description: "Is public",
            parse: parseBool,
            sdkKey: "isPublic",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Delete a plan group.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List plan groups with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a new plan group for organizing plans.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--is-public <boolean>",
            description: "Is public",
            parse: parseBool,
            sdkKey: "isPublic",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "plans",
    description: "Manage plans",
    sdkProperty: "plans",
    actions: {
      "publish-draft": {
        method: "publishDraft",
        description:
          "Publish a draft as the plan's current version, as a new experiment with its own code, or as the next version of the experiment it started from.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--draft-id <draft-id>",
            description: "Draft id",
            required: true,
            sdkKey: "draftId",
          },
          {
            flag: "--publish-as <publish-as>",
            description: "current sells the draft to every new buyer.",
            required: true,
            sdkKey: "publishAs",
          },
          {
            flag: "--move <move>",
            description:
              "What happens to subscribers of earlier versions: keep them, move them at their next renewal, or move them now (features and balance change today, the price at renewal).",
            sdkKey: "move",
          },
          {
            flag: "--changes <json>",
            description:
              "Per-subscriber changes that make each one fit, applied at its renewal.",
            parse: parseJson,
            sdkKey: "changes",
          },
          {
            flag: "--preview <boolean>",
            description: "Check everything without publishing.",
            parse: parseBool,
            sdkKey: "preview",
          },
          {
            flag: "--experiment-code <experiment-code>",
            description: "The experiment's own code, after the plan's code.",
            sdkKey: "experimentCode",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["publishAs"],
          ["publishAs", "experimentCode"],
          ["publishAs"],
        ],
      },
      "get-draft": {
        method: "getDraft",
        description:
          "Retrieve a draft with the version it started from and what it changes.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--draft-id <draft-id>",
            description: "Draft id",
            required: true,
            sdkKey: "draftId",
          },
        ],
      },
      "update-draft": {
        method: "updateDraft",
        description:
          "Change a draft's prices per interval, trials, the interval shown first, countries with their currency and prices, and credit or balance rules, or undo single changes.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--draft-id <draft-id>",
            description: "Draft id",
            required: true,
            sdkKey: "draftId",
          },
          {
            flag: "--prices <json>",
            description: "Every interval the draft sells.",
            parse: parseJson,
            sdkKey: "prices",
          },
          {
            flag: "--countries <json>",
            description: "Every country with its own currency or prices.",
            parse: parseJson,
            sdkKey: "countries",
          },
          {
            flag: "--rules <json>",
            description:
              "Credit or balance rules; fields left out stay as they are.",
            parse: parseJson,
            sdkKey: "rules",
          },
          {
            flag: "--undo <json>",
            description:
              "Change keys to put back as the version the draft started from had them.",
            parse: parseJson,
            sdkKey: "undo",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "delete-draft": {
        method: "deleteDraft",
        description: "Discard a draft.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--draft-id <draft-id>",
            description: "Draft id",
            required: true,
            sdkKey: "draftId",
          },
        ],
      },
      "list-drafts": {
        method: "listDrafts",
        description:
          "List the plan's open drafts, oldest first, each with the version it started from and what it changes.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "create-draft": {
        method: "createDraft",
        description:
          "Start a draft from a version of the plan: the current one, an experiment's version or an older one.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--from-version-id <from-version-id>",
            description:
              "The version to start from: the current version, an experiment's version or an older version.",
            sdkKey: "fromVersionId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "archive-experiment": {
        method: "archiveExperiment",
        description: "Stop selling the experiment.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--subscribers <subscribers>",
            description:
              "What happens to the experiment's subscribers: keep them on its versions, move them to the plan's current version at their next renewal, or move them now.",
            sdkKey: "subscribers",
          },
          {
            flag: "--changes <json>",
            description:
              "Per-subscriber changes that make each one fit, applied at its renewal.",
            parse: parseJson,
            sdkKey: "changes",
          },
          {
            flag: "--preview <boolean>",
            description:
              "Check the archive and the move without changing anything.",
            parse: parseBool,
            sdkKey: "preview",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "make-experiment-current": {
        method: "makeExperimentCurrent",
        description:
          "Make the experiment's latest version the plan's current version, with exactly its content and the next version number.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "get-experiment": {
        method: "getExperiment",
        description:
          "Get one experiment of a plan by its own code, with the version it sells and how many subscriptions are on it.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
        ],
      },
      "create-experiment-version": {
        method: "createExperimentVersion",
        description:
          "Publish the experiment's next version from its latest version with the changes given.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--prices <json>",
            description: "Prices",
            parse: parseJson,
            sdkKey: "prices",
          },
          {
            flag: "--currencies <json>",
            description:
              "Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage.",
            parse: parseJson,
            sdkKey: "currencies",
          },
          {
            flag: "--max-plan-credits <number|null>",
            description:
              "Credits plans that roll over unused credits: the most plan credits a subscription can hold.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanCredits",
          },
          {
            flag: "--max-plan-balance <number|null>",
            description:
              "Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanBalance",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "list-experiments": {
        method: "listExperiments",
        description:
          "List a plan's experiments, newest first, with the version each one sells and how many subscriptions are on them.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "create-experiment": {
        method: "createExperiment",
        description:
          "Start an experiment from the plan's current version with the changes given.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--prices <json>",
            description: "Prices",
            parse: parseJson,
            sdkKey: "prices",
          },
          {
            flag: "--currencies <json>",
            description:
              "Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage.",
            parse: parseJson,
            sdkKey: "currencies",
          },
          {
            flag: "--max-plan-credits <number|null>",
            description:
              "Credits plans that roll over unused credits: the most plan credits a subscription can hold.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanCredits",
          },
          {
            flag: "--max-plan-balance <number|null>",
            description:
              "Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanBalance",
          },
          {
            flag: "--code <code>",
            description:
              "The experiment's own code: lowercase letters, numbers, hyphens and underscores.",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "update-feature": {
        method: "updateFeature",
        description:
          "Update limits, overage, or enabled status of a feature on a plan.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--feature-id <feature-id>",
            description: "Feature id",
            required: true,
            sdkKey: "featureId",
          },
          {
            flag: "--enabled <boolean>",
            description: "Enabled",
            parse: parseBool,
            sdkKey: "enabled",
          },
          {
            flag: "--included-amount <number>",
            description: "Included amount",
            parse: parseNumber,
            sdkKey: "includedAmount",
          },
          {
            flag: "--unlimited <boolean>",
            description: "Unlimited",
            parse: parseBool,
            sdkKey: "unlimited",
          },
          {
            flag: "--overage <json>",
            description: "Overage",
            parse: parseJson,
            sdkKey: "overage",
          },
          {
            flag: "--credits-per-unit <number|null>",
            description: "Credits per unit",
            parse: parseNullableNumber,
            sdkKey: "creditsPerUnit",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "remove-feature": {
        method: "removeFeature",
        description: "Detach a feature from a plan.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--feature-id <feature-id>",
            description: "Feature id",
            required: true,
            sdkKey: "featureId",
          },
        ],
      },
      "add-feature": {
        method: "addFeature",
        description:
          "Attach a feature to a plan with limits, overage, and credits configuration.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--feature-id <feature-id>",
            description: "Feature id",
            required: true,
            sdkKey: "featureId",
          },
          {
            flag: "--enabled <boolean>",
            description: "Enabled",
            parse: parseBool,
            sdkKey: "enabled",
          },
          {
            flag: "--included-amount <number>",
            description: "Included amount",
            parse: parseNumber,
            sdkKey: "includedAmount",
          },
          {
            flag: "--unlimited <boolean>",
            description: "Unlimited",
            parse: parseBool,
            sdkKey: "unlimited",
          },
          {
            flag: "--overage <json>",
            description: "Overage",
            parse: parseJson,
            sdkKey: "overage",
          },
          {
            flag: "--credits-per-unit <number|null>",
            description: "Credits per unit",
            parse: parseNullableNumber,
            sdkKey: "creditsPerUnit",
          },
          {
            flag: "--pricing-mode <pricing-mode>",
            description: "Pricing mode",
            sdkKey: "pricingMode",
          },
          {
            flag: "--margin <number|null>",
            description: "Margin",
            parse: parseNullableNumber,
            sdkKey: "margin",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "cancel-move": {
        method: "cancelMove",
        description:
          "Cancel a move for every subscriber who has not moved yet.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--move-id <move-id>",
            description: "Move id",
            required: true,
            sdkKey: "moveId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "get-move": {
        method: "getMove",
        description:
          "Read a move of subscribers between plan versions with each subscriber's status: moving, moved, needs a change, left out, canceled or kept on its version.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--move-id <move-id>",
            description: "Move id",
            required: true,
            sdkKey: "moveId",
          },
        ],
      },
      "cancel-move-subscription": {
        method: "cancelMoveSubscription",
        description: "Cancel a move for one subscriber who has not moved yet.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--move-id <move-id>",
            description: "Move id",
            required: true,
            sdkKey: "moveId",
          },
          {
            flag: "--subscription-id <subscription-id>",
            description: "Subscription id",
            required: true,
            sdkKey: "subscriptionId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "list-moves": {
        method: "listMoves",
        description:
          "List a plan's latest moves of subscribers between versions, newest first, with how many are moving, moved, need a change, were left out, canceled or kept on their version.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "create-move": {
        method: "createMove",
        description:
          "Move a list of subscriptions, or every subscription of another version, to a newer version of the plan, at their next renewal or now.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--subscription-ids <json>",
            description: "Public IDs of the subscriptions to move.",
            parse: parseJson,
            sdkKey: "subscriptionIds",
          },
          {
            flag: "--to-version-id <to-version-id>",
            description: "The version subscribers move to.",
            required: true,
            sdkKey: "toVersionId",
          },
          {
            flag: "--effective <effective>",
            description:
              "now changes features and the included amount today and the price at renewal; period_end moves each subscriber at its next renewal.",
            required: true,
            sdkKey: "effective",
          },
          {
            flag: "--changes <json>",
            description:
              "Per-subscriber changes that make each one fit, applied at its renewal.",
            parse: parseJson,
            sdkKey: "changes",
          },
          {
            flag: "--preview <boolean>",
            description: "Check every subscriber without moving anyone.",
            parse: parseBool,
            sdkKey: "preview",
          },
          {
            flag: "--from-version-id <from-version-id>",
            description:
              "Move every active, trialing and past due subscription on this version of the plan.",
            sdkKey: "fromVersionId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["subscriptionIds", "toVersionId", "effective"],
          ["fromVersionId", "toVersionId", "effective"],
        ],
      },
      "keep-subscriber-on-version": {
        method: "keepSubscriberOnVersion",
        description: "Leave a subscriber that needs a change on its version.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--subscription-id <subscription-id>",
            description: "Subscription id",
            required: true,
            sdkKey: "subscriptionId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "list-subscribers-needing-achange": {
        method: "listSubscribersNeedingAChange",
        description:
          "List the plan's subscribers whose move could not complete, with the version they stay on, the one they could not move to and why.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "set-default-price": {
        method: "setDefaultPrice",
        description:
          "Set a specific price as the default and return the updated plan price.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--price-id <price-id>",
            description: "Price id",
            required: true,
            sdkKey: "priceId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "set-regional-prices": {
        method: "setRegionalPrices",
        description:
          "Create or update regional currency price overrides for a plan price.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--price-id <price-id>",
            description: "Price id",
            required: true,
            sdkKey: "priceId",
          },
          {
            flag: "--overrides <json>",
            description: "Overrides",
            required: true,
            parse: parseJson,
            sdkKey: "overrides",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "delete-regional-prices": {
        method: "deleteRegionalPrices",
        description: "Remove all regional currency overrides for a plan price.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--price-id <price-id>",
            description: "Price id",
            required: true,
            sdkKey: "priceId",
          },
        ],
      },
      "update-price": {
        method: "updatePrice",
        description: "Update a base price or market price variant.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--price-id <price-id>",
            description: "Price id",
            required: true,
            sdkKey: "priceId",
          },
          {
            flag: "--price <number>",
            description: "Price",
            parse: parseNumber,
            sdkKey: "price",
          },
          {
            flag: "--is-default <boolean>",
            description: "Is default",
            parse: parseBool,
            sdkKey: "isDefault",
          },
          {
            flag: "--trial-days <number>",
            description: "Trial days",
            parse: parseNumber,
            sdkKey: "trialDays",
          },
          {
            flag: "--trial-requires-payment-method <boolean>",
            description:
              "Set to false so the price's free trial starts without a payment method.",
            parse: parseBool,
            sdkKey: "trialRequiresPaymentMethod",
          },
          {
            flag: "--included-balance <number|null>",
            description: "Included balance",
            parse: parseNullableNumber,
            sdkKey: "includedBalance",
          },
          {
            flag: "--included-credits <number|null>",
            description: "Included credits",
            parse: parseNullableNumber,
            sdkKey: "includedCredits",
          },
          {
            flag: "--metadata <json>",
            description:
              "Metadata keys to merge into the existing price metadata.",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--market-prices <json>",
            description: "Market prices",
            parse: parseJson,
            sdkKey: "marketPrices",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "delete-price": {
        method: "deletePrice",
        description: "Archive a price for new subscriptions.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--price-id <price-id>",
            description: "Price id",
            required: true,
            sdkKey: "priceId",
          },
        ],
      },
      "add-price": {
        method: "addPrice",
        description: "Add a base price or a selectable market price variant.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--billing-interval <billing-interval>",
            description: "Billing interval",
            required: true,
            sdkKey: "billingInterval",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--price <number>",
            description: "Price",
            parse: parseNumber,
            sdkKey: "price",
          },
          {
            flag: "--trial-days <number>",
            description: "Trial days",
            parse: parseNumber,
            sdkKey: "trialDays",
          },
          {
            flag: "--trial-requires-payment-method <boolean>",
            description:
              "Set to false so the price's free trial starts without a payment method.",
            parse: parseBool,
            sdkKey: "trialRequiresPaymentMethod",
          },
          {
            flag: "--is-default <boolean>",
            description: "Is default",
            parse: parseBool,
            sdkKey: "isDefault",
          },
          {
            flag: "--included-balance <number|null>",
            description: "Included balance",
            parse: parseNullableNumber,
            sdkKey: "includedBalance",
          },
          {
            flag: "--included-credits <number|null>",
            description: "Included credits",
            parse: parseNullableNumber,
            sdkKey: "includedCredits",
          },
          {
            flag: "--market-prices <json>",
            description: "Market prices",
            parse: parseJson,
            sdkKey: "marketPrices",
          },
          {
            flag: "--inherits-from-price-id <inherits-from-price-id>",
            description: "Inherits from price id",
            sdkKey: "inheritsFromPriceId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["billingInterval", "price"],
          ["billingInterval", "inheritsFromPriceId", "marketPrices"],
        ],
      },
      "set-regional-pricing": {
        method: "setRegionalPricing",
        description:
          "Configure regional prices and feature overage values for one currency.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--currency <currency>",
            description: "Currency",
            required: true,
            sdkKey: "currency",
          },
          {
            flag: "--exchange-rate <number>",
            description: "Exchange rate",
            required: true,
            parse: parseNumber,
            sdkKey: "exchangeRate",
          },
          {
            flag: "--prices <json>",
            description: "Prices",
            parse: parseJson,
            sdkKey: "prices",
          },
          {
            flag: "--features <json>",
            description: "Features",
            parse: parseJson,
            sdkKey: "features",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Get a plan with public price IDs and their automatic introductory offer IDs.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description:
          "Update a plan's name, description, visibility, default status, metadata, overage behavior, what happens to its unused plan credits or plan balance, or its plan credit or plan balance limit.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--is-public <boolean>",
            description: "Is public",
            parse: parseBool,
            sdkKey: "isPublic",
          },
          {
            flag: "--unused-plan-credits <json>",
            description: "Credits plans only.",
            parse: parseJson,
            sdkKey: "unusedPlanCredits",
          },
          {
            flag: "--plan-credit-limit <json>",
            description: "Credits plans only.",
            parse: parseJson,
            sdkKey: "planCreditLimit",
          },
          {
            flag: "--unused-plan-balance <json>",
            description: "Balance plans only.",
            parse: parseJson,
            sdkKey: "unusedPlanBalance",
          },
          {
            flag: "--plan-balance-limit <json>",
            description: "Balance plans only.",
            parse: parseJson,
            sdkKey: "planBalanceLimit",
          },
          {
            flag: "--block-on-exhaustion <boolean>",
            description: "Credits and balance plans only.",
            parse: parseBool,
            sdkKey: "blockOnExhaustion",
          },
          {
            flag: "--is-default <boolean>",
            description:
              "Make this plan the default plan of its plan group: customers created with that planGroupId start on it, and a paid plan of the group that ends from the customer portal, a revoked payment authorization or exhausted dunning moves to it instead of canceling.",
            parse: parseBool,
            sdkKey: "isDefault",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Soft-delete a plan.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "compare-versions": {
        method: "compareVersions",
        description:
          "List what changes from one version of a plan to another: prices, trials, features, rules, add-ons, credit packs and countries.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--version-id <version-id>",
            description: "Version id",
            required: true,
            sdkKey: "versionId",
          },
          {
            flag: "--against <against>",
            description: "Against",
            required: true,
            sdkKey: "against",
          },
        ],
      },
      "get-version": {
        method: "getVersion",
        description:
          "Get one published version of a plan with its prices and how many subscriptions are on it.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--version-id <version-id>",
            description: "Version id",
            required: true,
            sdkKey: "versionId",
          },
        ],
      },
      "list-versions": {
        method: "listVersions",
        description:
          "List a plan's published versions, newest first, with their prices and how many subscriptions are on each.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      "create-version": {
        method: "createVersion",
        description:
          "Publish a new current version of the plan from its current version, changing prices per interval, included credits or balance, per-currency amounts and the rollover cap.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--prices <json>",
            description: "Prices",
            parse: parseJson,
            sdkKey: "prices",
          },
          {
            flag: "--currencies <json>",
            description:
              "Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage.",
            parse: parseJson,
            sdkKey: "currencies",
          },
          {
            flag: "--max-plan-credits <number|null>",
            description:
              "Credits plans that roll over unused credits: the most plan credits a subscription can hold.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanCredits",
          },
          {
            flag: "--max-plan-balance <number|null>",
            description:
              "Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents.",
            parse: parseNullableNumber,
            sdkKey: "maxPlanBalance",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "set-visibility": {
        method: "setVisibility",
        description:
          "Set a plan's public visibility and return the updated plan.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--is-public <boolean>",
            description: "Is public",
            required: true,
            parse: parseBool,
            sdkKey: "isPublic",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description:
          "List plans with public price IDs and their automatic introductory offer IDs.",
        hasParams: true,
        params: [
          {
            flag: "--include-private <boolean>",
            description: "Include private",
            parse: parseBool,
            sdkKey: "includePrivate",
          },
        ],
      },
      create: {
        method: "create",
        description:
          "Create a new plan with optional consumption model, visibility, plan group assignment, overage behavior, and the rollover and spend limit of its plan credits or plan balance.",
        hasParams: true,
        params: [
          {
            flag: "--name <name>",
            description: "Name",
            required: true,
            sdkKey: "name",
          },
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--consumption-model <consumption-model>",
            description: "Consumption model",
            sdkKey: "consumptionModel",
          },
          {
            flag: "--is-public <boolean>",
            description: "Is public",
            parse: parseBool,
            sdkKey: "isPublic",
          },
          {
            flag: "--is-free <boolean>",
            description: "Is free",
            parse: parseBool,
            sdkKey: "isFree",
          },
          {
            flag: "--block-on-exhaustion <boolean>",
            description: "Credits and balance plans.",
            parse: parseBool,
            sdkKey: "blockOnExhaustion",
          },
          {
            flag: "--unused-plan-credits <json>",
            description: "Credits plans only.",
            parse: parseJson,
            sdkKey: "unusedPlanCredits",
          },
          {
            flag: "--plan-credit-limit <json>",
            description: "Credits plans only.",
            parse: parseJson,
            sdkKey: "planCreditLimit",
          },
          {
            flag: "--unused-plan-balance <json>",
            description: "Balance plans only.",
            parse: parseJson,
            sdkKey: "unusedPlanBalance",
          },
          {
            flag: "--plan-balance-limit <json>",
            description: "Balance plans only.",
            parse: parseJson,
            sdkKey: "planBalanceLimit",
          },
          {
            flag: "--plan-group-id <plan-group-id>",
            description: "Plan group id",
            sdkKey: "planGroupId",
          },
          {
            flag: "--is-default <boolean>",
            description:
              "Make this plan the default plan of its plan group: customers created with that planGroupId start on it, and a paid plan of the group that ends from the customer portal, a revoked payment authorization or exhausted dunning moves to it instead of canceling.",
            parse: parseBool,
            sdkKey: "isDefault",
          },
          {
            flag: "--metadata <json>",
            description: "Metadata",
            parse: parseJson,
            sdkKey: "metadata",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "portal",
    description: "Manage portal",
    sdkProperty: "portal",
    actions: {
      "get-url": {
        method: "getUrl",
        description: "Generate a customer portal URL.",
        hasParams: true,
        params: [
          { flag: "--email <email>", description: "Email", sdkKey: "email" },
          {
            flag: "--return-url <return-url>",
            description: "Return url",
            sdkKey: "returnUrl",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [["email"], ["customerId"]],
      },
    },
  },
  {
    name: "promo-codes",
    description: "Manage promo codes",
    sdkProperty: "promoCodes",
    actions: {
      get: {
        method: "get",
        description: "Retrieve a promo code by its public ID.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description:
          "Update a promo code's billing interval, redemption limits, expiration, active status, or plan restrictions.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--billing-interval <billing-interval>",
            description: "Billing interval",
            sdkKey: "billingInterval",
          },
          {
            flag: "--max-redemptions <number|null>",
            description: "Max redemptions",
            parse: parseNullableNumber,
            sdkKey: "maxRedemptions",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--active <boolean>",
            description: "Active",
            parse: parseBool,
            sdkKey: "active",
          },
          {
            flag: "--plan-ids <json>",
            description: "Plan ids",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--first-purchase-only <boolean>",
            description:
              "Whether the code only applies to a customer's first purchase: one with no paid invoice above zero and no paid subscription.",
            parse: parseBool,
            sdkKey: "firstPurchaseOnly",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description: "List promo codes with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      create: {
        method: "create",
        description:
          "Create a distribution code for an existing Offer with one or more sequential discount phases.",
        hasParams: true,
        params: [
          {
            flag: "--code <code>",
            description: "Code",
            required: true,
            sdkKey: "code",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            required: true,
            sdkKey: "offerId",
          },
          {
            flag: "--billing-interval <billing-interval>",
            description: "Billing interval",
            sdkKey: "billingInterval",
          },
          {
            flag: "--max-redemptions <number>",
            description: "Max redemptions",
            parse: parseNumber,
            sdkKey: "maxRedemptions",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--plan-ids <json>",
            description: "Plan ids",
            parse: parseJson,
            sdkKey: "planIds",
          },
          {
            flag: "--first-purchase-only <boolean>",
            description:
              "Whether the code only applies to a customer's first purchase: one with no paid invoice above zero and no paid subscription.",
            parse: parseBool,
            sdkKey: "firstPurchaseOnly",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "seats",
    description: "Manage seats",
    sdkProperty: "seats",
    actions: {
      "get-balance": {
        method: "getBalance",
        description: "Get current balance for a specific seat type.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
        ],
      },
      "get-all-balances": {
        method: "getAllBalances",
        description:
          "Get the current balance for all seat types in a customer's subscription.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
      "set-all": {
        method: "setAll",
        description: "Set all seat types at once.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--seats <json>",
            description: "Seats",
            required: true,
            parse: parseJson,
            sdkKey: "seats",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      remove: {
        method: "remove",
        description: "Remove seats from a customer's subscription.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            required: true,
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      add: {
        method: "add",
        description: "Add seats to a customer's subscription.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            required: true,
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      set: {
        method: "set",
        description: "Set seats to an exact count.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            required: true,
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "subscriptions",
    description: "Manage subscriptions",
    sdkProperty: "subscriptions",
    actions: {
      "deactivate-addon": {
        method: "deactivateAddon",
        description: "Deactivate an add-on from a subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--addon-id <addon-id>",
            description: "Addon id",
            required: true,
            sdkKey: "addonId",
          },
        ],
      },
      "activate-addon": {
        method: "activateAddon",
        description: "Activate an add-on on a subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--addon-id <addon-id>",
            description: "Addon id",
            required: true,
            sdkKey: "addonId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "get-auto-top-up": {
        method: "getAutoTopUp",
        description:
          "Read whether the subscription tops up automatically with its saved payment method when its available credits or balance reach a threshold, with the top-ups used this period and the last failure.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "update-auto-top-up": {
        method: "updateAutoTopUp",
        description:
          "Turn automatic top-ups on or off and set the threshold, the size of each top-up and the maximum top-ups per period.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--enabled <boolean>",
            description: "Enabled",
            parse: parseBool,
            sdkKey: "enabled",
          },
          {
            flag: "--threshold <number>",
            description: "Threshold",
            parse: parseNumber,
            sdkKey: "threshold",
          },
          {
            flag: "--quantity <number>",
            description: "Credits each top-up buys.",
            parse: parseNumber,
            sdkKey: "quantity",
          },
          {
            flag: "--amount <number>",
            description:
              "Minor units of the subscription currency each top-up adds.",
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--max-per-period <number>",
            description: "Max per period",
            parse: parseNumber,
            sdkKey: "maxPerPeriod",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "adjust-balance": {
        method: "adjustBalance",
        description:
          "Adjust a subscription's balance or credits by a signed amount.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--amount <number>",
            description: "Amount",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            sdkKey: "reason",
          },
          { flag: "--type <type>", description: "Type", sdkKey: "type" },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "topup-balance": {
        method: "topupBalance",
        description: "Top up a balance subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--amount <number>",
            description:
              "The amount to add, in minor units of the subscription currency (cents; whole units for zero-decimal currencies).",
            required: true,
            parse: parseNumber,
            sdkKey: "amount",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      cancel: {
        method: "cancel",
        description:
          "Cancel immediately or at period end and return the updated subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            sdkKey: "reason",
          },
          {
            flag: "--immediate <boolean>",
            description: "Immediate",
            parse: parseBool,
            sdkKey: "immediate",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "change-plan": {
        method: "changePlan",
        description:
          "Upgrade or change billing interval immediately, optionally applying an Offer by offerId or the Offer of a promoCode.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--new-plan-id <new-plan-id>",
            description: "New plan id",
            sdkKey: "newPlanId",
          },
          {
            flag: "--new-billing-interval <new-billing-interval>",
            description: "New billing interval",
            sdkKey: "newBillingInterval",
          },
          {
            flag: "--success-url <success-url>",
            description: "Success url",
            sdkKey: "successUrl",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            sdkKey: "offerId",
          },
          {
            flag: "--promo-code <promo-code>",
            description: "Promo code",
            sdkKey: "promoCode",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [["promoCode"]],
      },
      "change-version": {
        method: "changeVersion",
        description:
          "Move a subscription to a newer published version of its plan, now or at the end of the period, without proration; an older version is rejected with version_not_newer, and a subscription on a running experiment moves only to a later version of that experiment.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--plan-version-id <plan-version-id>",
            description: "A published version of the subscription's plan.",
            required: true,
            sdkKey: "planVersionId",
          },
          {
            flag: "--effective <effective>",
            description:
              "now changes features, limits and the included credits or balance at once (the included difference is added to or subtracted from the plan credits or plan balance: an increase first pays any plan-part debt, a decrease never creates new debt, and purchased credits and purchased balance are untouched) and charges the new price from the next renewal.",
            required: true,
            sdkKey: "effective",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "purchase-credits": {
        method: "purchaseCredits",
        description:
          "Purchase a fixed credit pack or choose a whole credit quantity at the subscription plan price and minimum.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--credit-pack-id <credit-pack-id>",
            description: "Credit pack id",
            sdkKey: "creditPackId",
          },
          {
            flag: "--quantity <number>",
            description: "Quantity",
            parse: parseNumber,
            sdkKey: "quantity",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [["creditPackId"], ["quantity"]],
      },
      "apply-offer": {
        method: "applyOffer",
        description: "Apply a direct Offer to a subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            required: true,
            sdkKey: "offerId",
          },
          {
            flag: "--expires-at <expires-at>",
            description: "Expires at",
            sdkKey: "expiresAt",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "remove-offer": {
        method: "removeOffer",
        description:
          "Remove the quoted direct Offer from a subscription's pending payment checkout.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      pause: {
        method: "pause",
        description:
          "Pause immediately or schedule a pause for the end of the current billing or trial period.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--mode <mode>",
            description: "Mode",
            required: true,
            sdkKey: "mode",
          },
          {
            flag: "--duration-days <number|null>",
            description: "Duration days",
            required: true,
            parse: parseNullableNumber,
            sdkKey: "durationDays",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "update-pause": {
        method: "updatePause",
        description: "Change the duration of a scheduled or active pause.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--duration-days <number|null>",
            description: "Duration days",
            required: true,
            parse: parseNullableNumber,
            sdkKey: "durationDays",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "revoke-pause": {
        method: "revokePause",
        description: "Revoke a pause before it becomes effective.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "update-payment-method": {
        method: "updatePaymentMethod",
        description:
          "Creates a hosted checkout to update the payment method of an active, trialing or past_due subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--success-url <success-url>",
            description: "Success url",
            sdkKey: "successUrl",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "create-prepaid-periods-checkout": {
        method: "createPrepaidPeriodsCheckout",
        description:
          "Creates a hosted checkout to pay billing periods of a recurring subscription in advance with any payment method.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--periods <number>",
            description:
              "Active subscriptions: billing periods to add after the last paid period.",
            required: true,
            parse: parseNumber,
            sdkKey: "periods",
          },
          {
            flag: "--offer-id <offer-id>",
            description:
              "Offer applied from the first added period for its full configured duration.",
            sdkKey: "offerId",
          },
          {
            flag: "--success-url <success-url>",
            description: "Success url",
            sdkKey: "successUrl",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "preview-change": {
        method: "previewChange",
        description:
          "Preview proration details for an immediate plan change without applying it.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--plan-id <plan-id>",
            description: "Plan id",
            required: true,
            sdkKey: "planId",
          },
          {
            flag: "--billing-interval <billing-interval>",
            description: "Billing interval",
            sdkKey: "billingInterval",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            sdkKey: "offerId",
          },
          {
            flag: "--promo-code <promo-code>",
            description: "Promo code",
            sdkKey: "promoCode",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [["planId"], ["planId", "promoCode"]],
      },
      reactivate: {
        method: "reactivate",
        description: "Reactivates a subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            sdkKey: "offerId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "create-recovery-link": {
        method: "createRecoveryLink",
        description:
          "Generates a hosted, signed recovery link that lets the customer pay the outstanding renewal charge for a past_due subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      resume: {
        method: "resume",
        description: "Resume a paused subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Get a subscription by its public ID, regardless of status (including pending_payment and past_due).",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "revoke-scheduled-plan-change": {
        method: "revokeScheduledPlanChange",
        description:
          "Revoke the plan or interval change scheduled for the end of the period, so the subscription stays on its current plan.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      "revoke-scheduled-version-change": {
        method: "revokeScheduledVersionChange",
        description:
          "Cancel the move to another plan version pending for the next renewal, so the subscription stays on its version, and send subscription.version_change_canceled with reason canceled_by_merchant.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      uncancel: {
        method: "uncancel",
        description:
          "Revert a scheduled cancellation and return the updated subscription.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      "get-active": {
        method: "getActive",
        description: "Get the active subscription for a customer.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
      list: {
        method: "list",
        description: "List all subscriptions.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--status <status>",
            description: "Status",
            sdkKey: "status",
          },
          {
            flag: "--plan-version-id <plan-version-id>",
            description: "Plan version id",
            sdkKey: "planVersionId",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a subscription for a customer.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--billing-interval <billing-interval>",
            description: "Billing interval",
            sdkKey: "billingInterval",
          },
          {
            flag: "--price-id <price-id>",
            description: "Public price ID.",
            sdkKey: "priceId",
          },
          {
            flag: "--initial-seats <json>",
            description: "Initial seats",
            parse: parseJson,
            sdkKey: "initialSeats",
          },
          {
            flag: "--provider <provider>",
            description:
              "Payment provider name or exact public payment connection ID for the initial checkout.",
            sdkKey: "provider",
          },
          {
            flag: "--payment-method-types <json>",
            description: "Payment methods the initial checkout may offer.",
            parse: parseJson,
            sdkKey: "paymentMethodTypes",
          },
          { flag: "--name <name>", description: "Name", sdkKey: "name" },
          {
            flag: "--start-date <start-date>",
            description: "Start date",
            sdkKey: "startDate",
          },
          {
            flag: "--success-url <success-url>",
            description: "Success url",
            sdkKey: "successUrl",
          },
          {
            flag: "--prepaid-periods <number>",
            description:
              "Billing periods of the subscription's interval paid with the first payment, including the current one.",
            parse: parseNumber,
            sdkKey: "prepaidPeriods",
          },
          {
            flag: "--cancel-at-period-end <boolean>",
            description:
              "Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method.",
            parse: parseBool,
            sdkKey: "cancelAtPeriodEnd",
          },
          {
            flag: "--plan-version-id <plan-version-id>",
            description:
              "Public ID of a published version of the plan, current or not, including an experiment's versions.",
            sdkKey: "planVersionId",
          },
          {
            flag: "--offer-id <offer-id>",
            description: "Offer id",
            sdkKey: "offerId",
          },
          {
            flag: "--promo-code <promo-code>",
            description: "Promo code",
            sdkKey: "promoCode",
          },
          {
            flag: "--custom-trial-days <number>",
            description: "Trial length in days, replacing the price's trial.",
            parse: parseNumber,
            sdkKey: "customTrialDays",
          },
          {
            flag: "--skip-trial <boolean>",
            description: "Skip trial",
            parse: parseBool,
            sdkKey: "skipTrial",
          },
          {
            flag: "--plan-id <plan-id>",
            description: "Plan id",
            sdkKey: "planId",
          },
          {
            flag: "--plan-code <plan-code>",
            description:
              "The plan code, or an experiment code as `<plan code>:<experiment code>` to sell the version the experiment sells.",
            sdkKey: "planCode",
          },
          {
            flag: "--card-promotion-id <card-promotion-id>",
            description: "Public card promotion ID.",
            sdkKey: "cardPromotionId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["customerId", "planId"],
          ["customerId", "planCode"],
          ["customerId", "offerId", "planId"],
          ["customerId", "offerId", "planCode"],
          ["customerId", "cardPromotionId", "planId"],
          ["customerId", "cardPromotionId", "planCode"],
        ],
      },
    },
  },
  {
    name: "test-clock",
    description: "Manage test clock",
    sdkProperty: "testClock",
    actions: {
      "process-billing": {
        method: "processBilling",
        description: "Deprecated.",
        hasParams: false,
        params: [
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Returns the organization's current test clock state and latest durable run.",
        hasParams: false,
        params: [],
      },
      advance: {
        method: "advance",
        description:
          "Starts a durable run that moves the test clock forward and processes every billing deadline due before the target time.",
        hasParams: true,
        params: [
          {
            flag: "--advance-days <number>",
            description: "Advance days",
            parse: parseNumber,
            sdkKey: "advanceDays",
          },
          {
            flag: "--frozen-time <frozen-time>",
            description: "Frozen time",
            sdkKey: "frozenTime",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [["advanceDays"], ["frozenTime"]],
      },
    },
  },
  {
    name: "transactions",
    description: "Manage transactions",
    sdkProperty: "transactions",
    actions: {
      refund: {
        method: "refund",
        description:
          "Issue a full refund and return the provider-neutral refund resource with its actual status.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      retry: {
        method: "retry",
        description:
          "Retry a failed subscription renewal and return an honest retry result.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      get: {
        method: "get",
        description:
          "Retrieve a single payment transaction by its public ID, including provider details.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      list: {
        method: "list",
        description: "List payment transactions with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
          {
            flag: "--status <status>",
            description: "Status",
            sdkKey: "status",
          },
          {
            flag: "--customer-email <customer-email>",
            description: "Customer email",
            sdkKey: "customerEmail",
          },
        ],
      },
    },
  },
  {
    name: "usage",
    description: "Manage usage",
    sdkProperty: "usage",
    actions: {
      check: {
        method: "check",
        description:
          "Check if a customer can consume a feature before actual consumption.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--quantity <number>",
            description: "Quantity",
            parse: parseNumber,
            sdkKey: "quantity",
          },
        ],
      },
      track: {
        method: "track",
        description: "Track a usage event for a metered feature.",
        hasParams: true,
        params: [
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--event-id <event-id>",
            description: "Event id",
            sdkKey: "eventId",
          },
          {
            flag: "--timestamp <timestamp>",
            description: "Timestamp",
            sdkKey: "timestamp",
          },
          {
            flag: "--properties <json>",
            description: "Properties",
            parse: parseJson,
            sdkKey: "properties",
          },
          { flag: "--model <model>", description: "Model", sdkKey: "model" },
          {
            flag: "--input-tokens <number>",
            description: "Input tokens",
            parse: parseNumber,
            sdkKey: "inputTokens",
          },
          {
            flag: "--output-tokens <number>",
            description: "Output tokens",
            parse: parseNumber,
            sdkKey: "outputTokens",
          },
          {
            flag: "--value <number>",
            description: "Value",
            parse: parseNumber,
            sdkKey: "value",
          },
          {
            flag: "--cache-read-tokens <number>",
            description: "Cache read tokens",
            parse: parseNumber,
            sdkKey: "cacheReadTokens",
          },
          {
            flag: "--cache-write-tokens <number>",
            description: "Cache write tokens",
            parse: parseNumber,
            sdkKey: "cacheWriteTokens",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["featureCode", "customerId", "model", "inputTokens", "outputTokens"],
          ["featureCode", "customerId"],
        ],
      },
      set: {
        method: "set",
        description:
          "Set a metered feature's usage to an exact value for the current period.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--value <number>",
            description: "Value",
            required: true,
            parse: parseNumber,
            sdkKey: "value",
          },
          {
            flag: "--reason <reason>",
            description: "Reason",
            sdkKey: "reason",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
  {
    name: "quota",
    description: "Manage quota",
    sdkProperty: "quota",
    actions: {
      "get-all": {
        method: "getAll",
        description:
          "Get all quota allowances for a customer across every quota feature in their plan.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
        ],
      },
      remove: {
        method: "remove",
        description: "Remove from a customer's quota allowance for a feature.",
        hasParams: true,
        params: [
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["featureCode", "customerId"],
          ["featureCode", "externalId"],
        ],
      },
      get: {
        method: "get",
        description:
          "Get the current quota allowance (used vs included) for a specific feature.",
        hasParams: true,
        params: [
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            required: true,
            sdkKey: "customerId",
          },
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
        ],
      },
      add: {
        method: "add",
        description: "Add to a customer's quota allowance for a feature.",
        hasParams: true,
        params: [
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["featureCode", "customerId"],
          ["featureCode", "externalId"],
        ],
      },
      set: {
        method: "set",
        description:
          "Set a customer's quota allowance for a feature to an exact value.",
        hasParams: true,
        params: [
          {
            flag: "--feature-code <feature-code>",
            description: "Feature code",
            required: true,
            sdkKey: "featureCode",
          },
          {
            flag: "--count <number>",
            description: "Count",
            required: true,
            parse: parseNumber,
            sdkKey: "count",
          },
          {
            flag: "--customer-id <customer-id>",
            description: "Customer id",
            sdkKey: "customerId",
          },
          {
            flag: "--external-id <external-id>",
            description: "External id",
            sdkKey: "externalId",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
        requiredAlternatives: [
          ["featureCode", "count", "customerId"],
          ["featureCode", "count", "externalId"],
        ],
      },
    },
  },
  {
    name: "webhooks",
    description: "Manage webhooks",
    sdkProperty: "webhooks",
    actions: {
      get: {
        method: "get",
        description: "Retrieve a webhook endpoint by its public ID.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      update: {
        method: "update",
        description: "Update a webhook endpoint.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          { flag: "--url <url>", description: "Url", sdkKey: "url" },
          {
            flag: "--events <json>",
            description: "Events",
            parse: parseJson,
            sdkKey: "events",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--is-active <boolean>",
            description: "Is active",
            parse: parseBool,
            sdkKey: "isActive",
          },
          {
            flag: "--api-version <api-version>",
            description: "Api version",
            sdkKey: "apiVersion",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      delete: {
        method: "delete",
        description: "Permanently delete a webhook endpoint.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
        ],
      },
      test: {
        method: "test",
        description:
          "Send a test event to a webhook endpoint to verify connectivity.",
        hasParams: true,
        params: [
          {
            flag: "--id <id>",
            description: "Id",
            required: true,
            sdkKey: "id",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
      list: {
        method: "list",
        description: "List webhook endpoints with cursor-based pagination.",
        hasParams: true,
        params: [
          {
            flag: "--cursor <cursor>",
            description: "Cursor",
            sdkKey: "cursor",
          },
          {
            flag: "--limit <number>",
            description: "Limit",
            parse: parseNumber,
            sdkKey: "limit",
          },
        ],
      },
      create: {
        method: "create",
        description: "Create a new webhook endpoint.",
        hasParams: true,
        params: [
          {
            flag: "--url <url>",
            description: "Url",
            required: true,
            sdkKey: "url",
          },
          {
            flag: "--events <json>",
            description: "Events",
            required: true,
            parse: parseJson,
            sdkKey: "events",
          },
          {
            flag: "--description <description>",
            description: "Description",
            sdkKey: "description",
          },
          {
            flag: "--api-version <api-version>",
            description: "Api version",
            sdkKey: "apiVersion",
          },
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
      },
    },
  },
];
