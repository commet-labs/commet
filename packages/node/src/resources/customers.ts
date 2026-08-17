import type { RequestOptions } from "../types/common";
import type { Timezone } from "../types/enums";
import type {
  Customer,
  CustomerBatch,
  CustomerCredit,
  CustomerCreditRevocation,
  PlanGrant,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface RevokeCustomerCreditParams {
  id: string;
  creditId: string;
}

export interface ListCustomerCreditsParams {
  id: string;
}

export interface CreateCustomerCreditParams {
  id: string;
  /** Amount in the currency's smallest unit. */
  amount: number;
  currency:
    | "usd"
    | "ars"
    | "brl"
    | "clp"
    | "cop"
    | "pen"
    | "uyu"
    | "pyg"
    | "bob"
    | "mxn"
    | "cad"
    | "eur"
    | "jpy"
    | "cny"
    | "krw"
    | "hkd"
    | "sgd"
    | "twd"
    | "inr"
    | "thb";
  reason: string;
  expiresAt?: string | null;
}

export interface RevokePlanGrantParams {
  id: string;
  grantId: string;
  reason: string;
}

export type UpdatePlanGrantParams =
  | {
      id: string;
      grantId: string;
      reason: string;
      duration: "cycles";
      durationCycles: number;
    }
  | {
      id: string;
      grantId: string;
      reason: string;
      duration: "until_date";
      /** @format date-time */
      expiresAt: string;
    }
  | {
      id: string;
      grantId: string;
      reason: string;
      duration: "until_revoked";
    };

export interface ListPlanGrantsParams {
  id: string;
}

export type CreatePlanGrantParams =
  | {
      id: string;
      subscriptionId: string;
      planId: string;
      reason: string;
      duration: "cycles";
      durationCycles: number;
    }
  | {
      id: string;
      subscriptionId: string;
      planId: string;
      reason: string;
      duration: "until_date";
      /** @format date-time */
      expiresAt: string;
    }
  | {
      id: string;
      subscriptionId: string;
      planId: string;
      reason: string;
      duration: "until_revoked";
    };

export interface GetCustomerParams {
  id: string;
}

export interface UpdateCustomerParams {
  id: string;
  email?: string;
  fullName?: string;
  taxDocument?: string;
  externalId?: string;
  timezone?: Timezone;
  metadata?: Record<string, unknown>;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    region?: string;
  };
}

export interface BatchCreateCustomersParams {
  customers: Array<{
    email: string;
    id?: string;
    externalId?: string;
    fullName?: string;
    taxDocument?: string;
    timezone?: Timezone;
    metadata?: Record<string, unknown>;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      region?: string;
    };
  }>;
}

export interface ListCustomersParams {
  cursor?: string;
  limit?: number;
  externalId?: string;
}

export interface CreateCustomerParams {
  id?: string;
  externalId?: string;
  fullName?: string;
  taxDocument?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    region?: string;
  };
  addressId?: string;
  email: string;
  timezone?: Timezone;
  metadata?: Record<string, unknown>;
}

export class CustomersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Revoke the unallocated remainder of a customer credit grant. Applied invoice history is unchanged. */
  async revokeCredit(
    params: RevokeCustomerCreditParams,
    options?: RequestOptions,
  ): Promise<CustomerCreditRevocation> {
    const { id, creditId } = params;
    return this.httpClient.post(
      `/customers/${id}/credits/${creditId}/revoke`,
      {},
      options,
    );
  }

  /** List currency-specific invoice credit grants and their remaining balances for a customer. */
  async listCredits(
    params: ListCustomerCreditsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<CustomerCredit>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(`/customers/${id}/credits`, undefined, options);
  }

  /** Grant monetary credit in one currency. Credit is applied FIFO before tax to eligible recurring invoices. */
  async createCredit(
    params: CreateCustomerCreditParams,
    options?: RequestOptions,
  ): Promise<CustomerCredit> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/customers/${id}/credits`, rest, options);
  }

  /** End expanded access immediately and restore the base plan's limits. The subscription, billing cycle, invoices, and payment state remain unchanged. */
  async revokePlanGrant(
    params: RevokePlanGrantParams,
    options?: RequestOptions,
  ): Promise<PlanGrant> {
    const { id, grantId, ...rest } = params;
    return this.httpClient.post(
      `/customers/${id}/plan-grants/${grantId}/revoke`,
      rest,
      options,
    );
  }

  /** Keep the overlay for a number of the subscription's existing billing cycles, set an exact deadline, or leave it active until revoked. The billing anchor is never reset. */
  async updatePlanGrant(
    params: UpdatePlanGrantParams,
    options?: RequestOptions,
  ): Promise<PlanGrant> {
    const { id, grantId, ...rest } = params;
    return this.httpClient.patch(
      `/customers/${id}/plan-grants/${grantId}`,
      rest,
      options,
    );
  }

  /** List the independent audit timeline for paid-plan access granted without checkout or payment credentials. */
  async listPlanGrants(
    params: ListPlanGrantsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanGrant>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(
      `/customers/${id}/plan-grants`,
      undefined,
      options,
    );
  }

  /** Temporarily expand an active subscription's feature access using a higher plan in the same plan group. Billing, prices, periods, invoices, and the base subscription remain unchanged. */
  async createPlanGrant(
    params: CreatePlanGrantParams,
    options?: RequestOptions,
  ): Promise<PlanGrant> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/customers/${id}/plan-grants`, rest, options);
  }

  /** Retrieve a customer by their public ID, including subscription status and metadata. */
  async get(
    params: GetCustomerParams,
    options?: RequestOptions,
  ): Promise<Customer> {
    const { id } = params;
    return this.httpClient.get(`/customers/${id}`, undefined, options);
  }

  /** Update a customer's name, external ID, or metadata. */
  async update(
    params: UpdateCustomerParams,
    options?: RequestOptions,
  ): Promise<Customer> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/customers/${id}`, rest, options);
  }

  /** Create up to 100 customers in a single request. */
  async createBatch(
    params: BatchCreateCustomersParams,
    options?: RequestOptions,
  ): Promise<CustomerBatch> {
    return this.httpClient.post("/customers/batch", params, options);
  }

  /** List customers with cursor-based pagination. */
  async list(
    params?: ListCustomersParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Customer>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/customers", params, options);
  }

  /** Create a new customer. Idempotent when customerId is provided. */
  async create(
    params: CreateCustomerParams,
    options?: RequestOptions,
  ): Promise<Customer> {
    return this.httpClient.post("/customers", params, options);
  }
}
