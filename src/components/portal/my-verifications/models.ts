import { Money, PropertyType } from "@components/website/property/models";
import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface ForSaleBaseDto {
  title: string;
  location: string;
  price: Money;
}

// Create DTO
export interface CreateForSaleDto extends ForSaleBaseDto {
  type: PropertyType;
}

// Update DTO (full override)
export interface UpdateForSaleDto extends ForSaleBaseDto {}

export interface SearchForSaleDto extends PageRequest, BaseQueryDto {
    type: PropertyType
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryForSaleDto extends CreateForSaleDto, BaseQueryDto {
  status: PropertyStatus;
  views: number;
  inquiries: number;
}


export enum PropertyStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SOLD = "sold",
  HIDDEN = "hidden",
}
