/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface PaymentDetailBaseDto {}

// Create DTO
export interface CreatePaymentDetailDto extends PaymentDetailBaseDto {

}

// Update DTO (full override)
export interface UpdatePaymentDetailDto extends PaymentDetailBaseDto {}

export interface SearchPaymentDetailDto extends PageRequest, BaseQueryDto {

}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryPaymentDetailDto extends CreatePaymentDetailDto, BaseQueryDto {
  ref_id: string;
  payment_channel: PaymentChannel;
  gateway_response: string | undefined;
  property_title?: string;
  property_location?: string;
  seller?: string;
  date_paid?: string;
}

export enum PaymentChannel{
  PAYSTACK = "paystack",
  FLUTTERWAVE = "flutterwave"
}
