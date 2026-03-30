import type { Commet, GeneratedFeatureCode } from "@commet/node";

export interface CommetAIOptions {
  commet: Commet;
  feature: GeneratedFeatureCode;
  customerId: string;
  idempotencyKey?: string;
  onTrackingError?: (error: Error) => void;
}
