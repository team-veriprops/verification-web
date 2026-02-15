/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, PageRequest, Money, PaymentMethod, PropertyType, TransactionCurrency } from "types/models";
import { VerificationCategory } from "../verifications/models";

// Base Interfaces
export interface PaymentBaseDto {}

// Create DTO
export interface CreatePaymentDto extends PaymentBaseDto {
  // property_id?: string;
}

// Update DTO (full override)
export interface UpdatePaymentDto extends PaymentBaseDto {}

export interface SearchPaymentDto extends PageRequest, BaseQueryDto {
    status?: PaymentStatus
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryPaymentDto extends CreatePaymentDto, BaseQueryDto {
  refId: string;
  description: string;
  amount: Money;
  status: PaymentStatus;
}

export interface PaymentStats{
  totalSpentAmount: Money
  lastPaymentDate: string
  totalPendingAmount: Money
  totalPending: number;
  totalPayment: number
}

export enum PaymentType {
  DEPOSIT = "deposit",
  ESCROW = "escrow",
  WITHDRAWAL = "withdrawal",
  FEE = "fee",
  ALL = "all"
}

export enum PaymentStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentObject {
  VERIFICATION = "verification",
}

// Checkout
export interface QueryPaymentCheckoutDto {
  invoiceId: string;
  paymentObject: PaymentObject;
  paymentObjectId: string;
  contractId?: string;

  title: string;
  description: string;
  address: string;
  category: VerificationCategory;
  propertyType: PropertyType

  vatRate: number
  ngnEquivalent: Money
  cost: Money;
  tax: Money;
  total: Money;
  paymentMethods: QueryAvailablePaymentMethodDto[];
  message?: string;
}

// Authorize
export interface QueryPaymentAuthorizationDto{
  authorizationUrl: string
}


// Available Payments
export interface QueryAvailablePaymentMethodDto {
    key: PaymentMethod;
    name: string;
    description: string;
    supportedCurrencies: TransactionCurrency[];
    enabled: boolean
}

export interface SearchAvailablePaymentMethodDto extends PageRequest, BaseQueryDto {

}
