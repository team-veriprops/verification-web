import { BaseQueryDto, PageRequest } from "types/models";
import { PhoneNumber } from "@components/ui/form/CountryCodeSelect";
import { EmailSource } from "@components/website/auth/models";


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

export interface JwtPayload {
  sub?: string
  email?: string
  exp?: number
  iat?: number
  role?: string
  user_type: UserType
}

// User
export interface UserBaseDto {
  bio?: string;
}

export interface CreateUserDto extends UserBaseDto {
  invitedUserId?: string;
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

export interface UpdateProfileDto extends UserBaseDto {
  firstname: string;
  middleName: string;
  lastname: string;
  dob?: Date;
  gender?: Gender;
}

export interface SearchUserDto extends PageRequest, BaseQueryDto {
  userId?: string;
  userType?: UserType;
  persona?: UserPersona
}

export interface QueryUserDto extends BaseQueryDto, UserBaseDto {
  fullname: string;
  userType?: UserType;
  persona?: UserPersona;
  avatar?: string;
  phone?: PhoneNumber
  email?: string
}


// Invites
export interface CreateInvitedUserDto {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface SearchInvitedUserDto extends PageRequest, BaseQueryDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  userType?: UserType;
}

export interface QueryInvitedUserDto extends CreateInvitedUserDto, BaseQueryDto {
  fullname: string;
  userType: UserType;
  dateReinvited: string
}
