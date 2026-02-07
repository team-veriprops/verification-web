/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, ExactLocation, Measurement, Money, PageRequest, PropertyType } from "types/models";

// Base Interfaces
export interface VerificationBaseDto {
  property_type: PropertyType;
  property_title: string;
  property_plot_size: Measurement;
  location?: ExactLocation;
  property_estimated_price: Money;
  survey_plan_number?: string;
  beacon_numbers?: string;
  documents: VerificationDocument[];

  category: VerificationCategory;
  owner_fullname: string;
  seller_info: SellerInfo;
  additional_details?: string;
  source_url?: string;
  source_platform?: string;
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
  ref_id: string;
  status: VerificationStatus;
  risk_score?: number;
  date_completed?: string;
  paid: boolean;
}

export interface VerificationDocument {
  type: DocumentType;
  id?: string;
  file?: File;
  preview?: string;

  name?: string;
  status?: VerificationStatus;
  verified_date?: string;
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
  full_name: string;
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
