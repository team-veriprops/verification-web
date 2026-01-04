import { Money, PropertyType } from "@components/website/property/models";
import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface TransactionBaseDto {}

// Create DTO
export interface CreateTransactionDto extends TransactionBaseDto {
  // property_id?: string;
}

// Update DTO (full override)
export interface UpdateTransactionDto extends TransactionBaseDto {}

export interface SearchTransactionDto extends PageRequest, BaseQueryDto {
    type?: TransactionType
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryTransactionDto extends CreateTransactionDto, BaseQueryDto {
  ref_id: string;
  type: TransactionType;
  amount: Money;
  status: TransactionStatus;
}

export interface TransactionStat{
  total: Money
  wallet: Money
  escrow: Money
}

export interface TransactionStats{
  totalBalance: TransactionStat
  totalInflow: TransactionStat
  totalOutflow: TransactionStat
  walletBalance: Money
}

export enum TransactionType {
  DEPOSIT = "deposit",
  ESCROW = "escrow",
  WITHDRAWAL = "withdrawal",
  FEE = "fee",
  ALL = "all"
}

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

