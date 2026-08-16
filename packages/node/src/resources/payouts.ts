import type { RequestOptions } from "../types/common";
import type { Payout, PayoutBankAccount } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface AddPayoutBankAccountParams {
  accountNumber: string;
  accountHolderName: string;
  routingNumber?: string;
  accountType?: "checking" | "savings";
  setDefault?: boolean;
}

export interface RequestPayoutParams {
  amount: number;
  description?: string;
}

export class PayoutsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Add an additional destination bank account to the organization's existing payout account. Country and currency are resolved from the organization. The full account number is never returned — only `last4`. */
  async addBankAccount(
    params: AddPayoutBankAccountParams,
    options?: RequestOptions,
  ): Promise<PayoutBankAccount> {
    return this.httpClient.post("/payouts/bank-accounts", params, options);
  }

  /** Withdraw available balance to the organization's verified payout account. `amount` is in cents (USD, minimum 1000 = $10). The payout is created in `pending` and settles to `paid` asynchronously as provider webhooks arrive. */
  async request(
    params: RequestPayoutParams,
    options?: RequestOptions,
  ): Promise<Payout> {
    return this.httpClient.post("/payouts", params, options);
  }

  /**
   * Deprecated. Complete business and identity verification in the Commet dashboard. This endpoint no longer accepts or processes KYC data.
   * @deprecated
   */
  async completeVerification(options?: RequestOptions): Promise<void> {
    return this.httpClient.post("/payouts/verification", {}, options);
  }
}
