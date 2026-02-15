/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, ExactLocation, Measurement, Money, PageRequest, PropertyType } from "types/models";

// Base Interfaces
export interface VerificationBaseDto {
  propertyType: PropertyType;
  propertyTitle: string;
  propertyPlotSize: Measurement;
  location?: ExactLocation;
  propertyEstimatedPrice: Money;
  surveyPlanNumber?: string;
  beaconNumbers?: string;
  documents: VerificationDocument[];

  category: VerificationCategory;
  ownerFullName: string;
  sellerInfo: SellerInfo;
  additionalDetails?: string;
  sourceUrl?: string;
  sourcePlatform?: string;
}

// Create DTO
export interface CreateVerificationDto extends VerificationBaseDto {

}

// Update DTO (full override)
export interface UpdateVerificationDto extends VerificationBaseDto {}

export interface SearchVerificationDto extends PageRequest, BaseQueryDto {
    status?: VerificationStatus
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryVerificationDto extends CreateVerificationDto, BaseQueryDto {
  refId: string;
  status: VerificationStatus;
  riskScore?: number;
  dateCompleted?: string;
  paid: boolean;
  invoiceId: string
}

export interface VerificationDocument {
  type: DocumentType;
  id?: string;
  file?: Blob;
  preview?: string;

  name?: string;
  status?: VerificationStatus;
  verifiedDate?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export enum VerificationStatus {
  VERIFIED = "verified",
  PENDING = "pending",
  FLAGGED = "flagged",
  CANCELLED = "cancelled",
}

export enum VerificationCategory {
   BASIC = 'basic',
   STANDARD = 'standard',
   PREMIUM = 'premium'
}

export interface SellerInfo {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
}

// export type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial';
// export type PlotSizeUnit = 'sqm' | 'hectares' | 'acres' | 'plots';
export enum DocumentType {
  TITLE = 'title',
  SURVEY = 'survey',
  PHOTO = 'photo',
  OTHER = 'other'
}


// Tier
export interface QueryVerificationTierDto {
  category: VerificationCategory;
  name: string;
  description: string;
  features: string[];
  label: string;
  priceNgn: Money;
  recommended?: boolean;
}

export interface SearchVerificationTierDto extends PageRequest, BaseQueryDto {

}
