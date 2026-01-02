import { BaseQueryDto, PageRequest } from "types/models";
import { QueryProfileDto, SearchProfileDto } from "./profile/models";

export interface UpdateUserDto {
  dob?: string;
  gender?: Gender;
  last_active_date?: string;
  email?: string;
  phone?: string;
  phone_ext?: string;
  password?: string;
  password_last_updated?: string;
  status?: UserStatus;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  notes?: string;
  avatar?: string
}


export interface QueryUserDto extends BaseQueryDto, UpdateUserDto {
  fullname?: string;
  type?: UserType;
  role: string;
}

export interface CreateUserDto {
  otp: string;
  email: string;
  phone?: string;
  phone_ext?: string;
  password: string;
  first_name: string;  // min length: 2, max length: 30
  last_name: string;   // min length: 2, max length: 30
  gender?: Gender;
}

export interface UpdateNameDto {
  first_name: string;
  middle_name: string;
  last_name: string;
}

export interface SearchUserDto extends PageRequest, BaseQueryDto, UpdateUserDto {
  user_type?: UserType;
}

export interface SearchUserAndProfileDto extends SearchProfileDto, SearchUserDto {}

export interface LoginSuccessDto extends QueryUserDto, QueryProfileDto {
  profile_id?: string;
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
