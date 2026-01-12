/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, ExactLocation, Measurement, Money, PageRequest, PropertyType } from "types/models";

// Base Interfaces
export interface VerificationBaseDto {}

// Create DTO
export interface CreateVerificationDto extends VerificationBaseDto {
  // property_id?: string;
}

// Update DTO (full override)
export interface UpdateVerificationDto extends VerificationBaseDto {}

export interface SearchVerificationDto extends PageRequest, BaseQueryDto {
    status?: VerificationStatus
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryVerificationDto extends CreateVerificationDto, BaseQueryDto {
  ref_id: string;
  property_type: PropertyType;
  location: ExactLocation;
  status: VerificationStatus;
  risk_score?: number;
  date_completed?: string;
  owner_fullname: string;
  paid: boolean;

  property_title: string;
  property_description: string;
  property_plot_size: Measurement;
  property_estimated_price: Money;

  documents: VerificationDocument[];
}

export interface VerificationDocument {
  name: string;
  status: VerificationStatus;
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
