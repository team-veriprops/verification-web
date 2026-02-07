/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, PageRequest, Money } from "types/models";

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
