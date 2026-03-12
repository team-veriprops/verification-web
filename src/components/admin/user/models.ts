import { BaseQueryDto, PageRequest } from "types/models";
import { QueryProfileDto, SearchProfileDto } from "./profile/models";
import { PhoneNumber } from "@components/ui/form/CountryCodeSelect";
import { EmailSource } from "@components/website/auth/models";

export interface UpdateUserDto {
  dob?: string;
  gender?: Gender;
  lastActiveDate?: string;
  email?: string;
  phone?: PhoneNumber;
  password?: string;
  password_last_updated?: string;
  status?: UserStatus;
  firstname?: string;
  middle_name?: string;
  lastname?: string;
  notes?: string;
  avatar?: string
}


export interface QueryUserDto extends BaseQueryDto, UpdateUserDto {
  fullname: string;
  type?: UserType;
  role: string;
}

export interface CreateUserDto {
  phoneOtp: string;
  emailOtp: string;
  email: string;
  phone?: PhoneNumber;
  password: string;
  firstname: string;  // min length: 2, max length: 30
  lastname: string;   // min length: 2, max length: 30
  gender?: Gender;
  emailSource: EmailSource
}

export interface UpdateNameDto {
  firstname: string;
  middle_name: string;
  lastname: string;
}

export interface SearchUserDto extends PageRequest, BaseQueryDto, UpdateUserDto {
  userType?: UserType;
}

export interface SearchUserAndProfileDto extends SearchProfileDto, SearchUserDto {}

export interface LoginSuccessDto extends QueryUserDto, QueryProfileDto {
  profileId?: string;
  pending_kyc?: string[]
}




export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
  DEACTIVATED = 'deactivated',
}

export enum UserPersona {
  GUEST = 'GUEST',
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  VERIFIER = 'VERIFIER',
  REFERRER = 'REFERRER'
}

export enum UserType {
  ADMIN = 'A',
  USER = 'U',
  SYSTEM = 'S'
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHERS = 'O',
}

export enum Roles {
  SUPER_USER = 'SUPER_USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  SURVEYOR = 'SURVEYOR',
  LAWYER = 'LAWYER',
}


export interface SuccessResponse<T> {
  status: string;          // always "success"
  code: string;            // typically "200"
  message?: string;
  trace_id?: string;
  data?: T;
}
