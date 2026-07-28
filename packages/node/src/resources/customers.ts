import type { RequestOptions } from "../types/common";
import type { Timezone } from "../types/enums";
import type { Customer, CustomerBatch } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

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
