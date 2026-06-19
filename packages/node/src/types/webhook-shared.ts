export interface WebhookPlanRef {
  id: string;
  name: string;
}

export interface WebhookAddonRef {
  id: string;
  name: string;
}

export interface WebhookCardInfo {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface WebhookBankRef {
  bankName: string;
  last4: string;
}

export interface WebhookFeatureAccess {
  code: string;
  name: string;
  type: string;
  allowed: boolean;
  enabled: boolean | null;
  current: number | null;
  included: number | null;
  remaining: number | null;
  overageQuantity: number | null;
  overageUnitPrice: number | null;
  unlimited: boolean | null;
  overageEnabled: boolean | null;
  billedQuantity: number | null;
}

export interface WebhookSeatSummary {
  code: string;
  current: number | null;
  included: number | null;
  remaining: number | null;
  unlimited: boolean | null;
}

export interface WebhookCreditsBalance {
  planCredits: number;
  purchasedCredits: number;
  totalCredits: number;
}

export interface WebhookBalance {
  currentBalance: number;
}
