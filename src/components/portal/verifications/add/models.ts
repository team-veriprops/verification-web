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
  type: 'title' | 'survey' | 'photo' | 'other';
  preview?: string;
}

export interface PropertyDetails {
  propertyType: 'residential' | 'commercial' | 'land' | 'industrial';
  propertyTitle: string;
  plotSize: string;
  plotSizeUnit: 'sqm' | 'hectares' | 'acres' | 'plots';
  address: string;
  formattedAddress: string;
  lga: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  estimatedPrice: number;
  currency: 'NGN' | 'USD';
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
export type Currency = 'NGN' | 'USD';
export type DocumentType = 'title' | 'survey' | 'photo' | 'other';
