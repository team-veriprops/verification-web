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
  refId: string;
  paymentChannel: PaymentChannel;
  gatewayResponse: string | undefined;
  propertyTitle?: string;
  propertyLocation?: string;
  seller?: string;
  datePaid?: string;
}

export enum PaymentChannel{
  PAYSTACK = "paystack",
  FLUTTERWAVE = "flutterwave"
}
