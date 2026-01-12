/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseQueryDto, PageRequest } from "types/models";
import { TimelineEvent } from "../models";

// Base Interfaces
export interface VerificationDetailBaseDto {}

// Create DTO
export interface CreateVerificationDetailDto extends VerificationDetailBaseDto {

}

// Update DTO (full override)
export interface UpdateVerificationDetailDto extends VerificationDetailBaseDto {}

export interface SearchVerificationDetailDto extends PageRequest, BaseQueryDto {

}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryVerificationDetailDto extends CreateVerificationDetailDto, BaseQueryDto {
  ref_id: string;
  title_status: string;
  encumbrances: string[];
  timeline: TimelineEvent[];
}
