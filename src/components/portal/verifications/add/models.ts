import { Currency, VerificationCategory } from "../checkout/models";

export interface SellerInfo {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
}

export interface UploadedDocument {
  id: string;
  file: File;
  name: string;
  type: DocumentType;
  preview?: string;
}

export interface PropertyDetails {
  propertyType: PropertyType;
  propertyTitle: string;
  plotSize: string;
  plotSizeUnit: PlotSizeUnit;
  address: string;
  category: VerificationCategory;
  formattedAddress: string;
  lga: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  estimatedPrice: number;
  currency: Currency;
  surveyPlanNumber?: string;
  beaconNumbers?: string;
  ownerFullName: string;
  sellerInfo: SellerInfo;
  additionalDetails?: string;
  documents: UploadedDocument[];
  sourceUrl?: string;
  sourcePlatform?: string;
}

export interface AddressDetails {
  address: string;
  formattedAddress: string;
  state?: string;
  lga?: string;
  coordinates?: { lat: number; lng: number };
}

export type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial';
export type PlotSizeUnit = 'sqm' | 'hectares' | 'acres' | 'plots';
export type DocumentType = 'title' | 'survey' | 'photo' | 'other';
