import type { ResourceDef } from "./factory";
import { parseBool, parseJson, parseNumber } from "./param-types";

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
        description: "Update an add-on's name, description, or pricing.",
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
        description: "Create a new API key.",
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
          "Update a credit pack's name, description, credits, price, or active status.",
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
            flag: "--credits-per-unit <number>",
            description: "Credits per unit",
            parse: parseNumber,
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
            flag: "--credits-per-unit <number>",
            description: "Credits per unit",
            parse: parseNumber,
            sdkKey: "creditsPerUnit",
          },
          {
            flag: "--pricing-mode <pricing-mode>",
            description: "Pricing mode",
            sdkKey: "pricingMode",
          },
          {
            flag: "--margin <number>",
            description: "Margin",
            parse: parseNumber,
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
            flag: "--included-balance <number>",
            description: "Included balance",
            parse: parseNumber,
            sdkKey: "includedBalance",
          },
          {
            flag: "--included-credits <number>",
            description: "Included credits",
            parse: parseNumber,
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
            flag: "--is-default <boolean>",
            description: "Is default",
            parse: parseBool,
            sdkKey: "isDefault",
          },
          {
            flag: "--included-balance <number>",
            description: "Included balance",
            parse: parseNumber,
            sdkKey: "includedBalance",
          },
          {
            flag: "--included-credits <number>",
            description: "Included credits",
            parse: parseNumber,
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
          "Update a plan's name, description, visibility, or metadata.",
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
          "Create a new plan with optional consumption model, visibility, and plan group assignment.",
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
            description: "Block on exhaustion",
            parse: parseBool,
            sdkKey: "blockOnExhaustion",
          },
          {
            flag: "--plan-group-id <plan-group-id>",
            description: "Plan group id",
            sdkKey: "planGroupId",
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
        description: "Create a distribution code for an existing Offer.",
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
        description: "Top up a subscription's balance.",
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
          "Upgrade or change billing interval immediately, optionally applying an Offer.",
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
        description: "Purchase a credit pack for a subscription.",
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
            required: true,
            sdkKey: "creditPackId",
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
      "apply-offer": {
        method: "applyOffer",
        description:
          "Apply or replace a direct Offer on a subscription's pending payment checkout.",
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
      "update-payment-method": {
        method: "updatePaymentMethod",
        description:
          "Creates a hosted checkout session for the customer to update the subscription's default payment method.",
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
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
          },
        ],
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
            description: "Custom trial days",
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
            description: "Plan code",
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
          {
            flag: "--idempotency-key <key>",
            description:
              "Unique key used to safely retry this write for 24 hours without applying it twice.",
            sdkKey: "idempotencyKey",
            requestOption: true,
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
