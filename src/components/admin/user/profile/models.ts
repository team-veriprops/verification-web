import { BaseQueryDto, PageRequest } from "../../../../types/models";
import { UserPersona } from "../models";

export interface UpdateProfileDto {
  personas?: UserPersona[];
  hasProfilePicture?: boolean;
  hasSelfiePicture?: boolean;
  bio?: string;
  languages?: string[];
  bvn?: string;
  bvnValidated?: boolean;
  phoneValidated?: boolean;
  emailValidated?: boolean;
  identityValidated?: boolean;
  address_id?: string;
  addressValidated?: boolean;
  seller_id?: string;
  agent_id?: string;
}

export interface SearchProfileDto extends PageRequest, BaseQueryDto, UpdateProfileDto {
  user_id?: string;
  language?: string;
  walletId?: string;
  escrowId?: string;
  inboxId?: string;
  persona?: UserPersona;
}

export interface QueryProfileDto extends BaseQueryDto, UpdateProfileDto {
  user_id?: string;
  walletId?: string;
  escrowId?: string;
  inboxId?: string;
  picture?: string;
  referral_code?: string;
  verifierId?: string;
}
