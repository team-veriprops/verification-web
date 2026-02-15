// export type VerificationCategory = 'basic' | 'standard' | 'premium';

import { TransactionCurrency } from "types/models";
import { VerificationCategory } from "../models";


export type PaymentState = 'idle' | 'processing' | 'success' | 'failure';

export interface PropertyInfo {
  name: string;
  reference: string;
  location: string;
  type: string;
}

export interface VerificationTier {
  id: VerificationCategory;
  name: string;
  description: string;
  features: string[];
  label: string;
  priceNGN: number;
  recommended?: boolean;
}

export interface FXRate {
  currency: TransactionCurrency;
  rate: number;
  lockedAt: Date | null;
  expiresAt: Date | null;
}

export interface PaymentSummary {
  verificationFee: number;
  vat: number;
  total: number;
  currency: TransactionCurrency;
  fxRate?: number;
  ngnEquivalent?: number;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  amount: number;
  currency: TransactionCurrency;
  category: VerificationCategory;
  timestamp: Date;
}
