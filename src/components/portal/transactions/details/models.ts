import { Money } from "@components/website/property/models";
import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface TransactionDetailBaseDto {}

// Create DTO
export interface CreateTransactionDetailDto extends TransactionDetailBaseDto {
  // property_id?: string;
}

// Update DTO (full override)
export interface UpdateTransactionDetailDto extends TransactionDetailBaseDto {}

export interface SearchTransactionDetailDto extends PageRequest, BaseQueryDto {

}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryTransactionDetailDto extends CreateTransactionDetailDto, BaseQueryDto {
  ref_id: string;
  payment_channel: PaymentChannel;
  gateway_response: string;
  wallet_impact: WalletImpact;
  escrow_fee?: Money
  escrow_id?: string;
  escrow_estimated_release_time?: string;
  contract_id?: string;
  property_title?: string;
  property_slug?: string;
  property_location?: string;
  seller?: string;
  buyer?: string;
}

export enum PaymentChannel{
  PAYSTACK = "paystack",
  FLUTTERWAVE = "flutterwave"
}

export enum WalletImpact {
  CREDITED = "Credited",
  DEBITED = "Debited",
  NEUTRAL = "Neutral",
}
