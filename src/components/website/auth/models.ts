import { UserPersona } from "@components/admin/user/models";
import { PhoneNumber } from "@components/ui/form/CountryCodeSelect";

export interface RedirectResponse {
  redirectUrl: string;
}

export enum SocialAuthType {
  LOGIN = "login",
  SIGNUP = "signup",
}

export enum SocialAuthProvider {
  GOOGLE = "google",
  APPLE = "apple",
  FACEBOOK = "facebook",
}

export enum SocialAuthResponseType {
  SOCIALAUTH_LINK_REQUIRED = "SOCIALAUTH_LINK_REQUIRED",
  SOCIALAUTH_SUCCEEDED = "SOCIALAUTH_SUCCEEDED",
  SOCIALAUTH_DATA_REQUIRED = "SOCIALAUTH_DATA_REQUIRED",
}

export enum EmailSource {
  APPLE = "apple",
  FACEBOOK = "facebook",
  GOOGLE = "google",
  EMAIL_LOGIN = "email-login",
  ADMIN = "admin",
  MANUAL = "manual",
}

export interface SocialLoginUserInfoDto {
  provider: SocialAuthProvider;

  id?: string;
  email?: string;
  email_verified?: boolean;

  firstname?: string;
  lastname?: string;

  exp?: number;

  otp: string;

  operation_type?: SocialAuthType;

  frontend_origin: string;

  response_code?: SocialAuthResponseType;

  response_message?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface VerificationRequestDto {
  email?: string | null;
  phone?: PhoneNumber | null
  isANewUser: boolean;
  otp?: string | null;
}

export interface RecoverPasswordPayload {
  token: string;
  newPassword: string;
}

export interface RecoverPasswordMessagePayload {
  email: string;
}

export interface InitSocialLoginResponse {
  redirectUrl: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
}

export interface ActiveAuditor {
  id: string;
  dob?: Date;
  firstname: string;
  lastname: string;
  fullname: string;
  phone?: PhoneNumber;
  email: string;
  userType: string;
  personas?: UserPersona[];
  lastActiveDate?: Date;

  hasProfilePicture?: boolean;
  hasSelfiePicture?: boolean;
  phoneValidated?: boolean;
  emailValidated?: boolean;
  languages?: string[];
  bvnValidated?: boolean;
  identityValidated?: boolean;
  addressValidated?: boolean;
  driverId?: string;
  walletId?: string;
  profileId?: string;
  hostId?: string;
  escrowId?: string;
  inboxId?: string;
}

