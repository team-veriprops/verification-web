import { BaseQueryDto, PageRequest } from "../../../types/models";
import { UserPersona } from "../models";

export interface UpdateProfileDto {
  personas?: UserPersona[];
  has_profile_picture?: boolean;
  has_selfie_picture?: boolean;
  bio?: string;
  languages?: string[];
  bvn?: string;
  bvn_validated?: boolean;
  phone_validated?: boolean;
  email_validated?: boolean;
  identity_validated?: boolean;
  address_id?: string;
  address_validated?: boolean;
  seller_id?: string;
  agent_id?: string;
}

export interface SearchProfileDto extends PageRequest, BaseQueryDto, UpdateProfileDto {
  user_id?: string;
  language?: string;
  wallet_id?: string;
  escrow_id?: string;
  inbox_id?: string;
  persona?: UserPersona;
}

export interface QueryProfileDto extends BaseQueryDto, UpdateProfileDto {
  user_id?: string;
  wallet_id?: string;
  escrow_id?: string;
  inbox_id?: string;
  picture?: string;
  referral_code?: string;
  verifier_id?: string;
}
