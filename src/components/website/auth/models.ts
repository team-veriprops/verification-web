import { UserPersona } from "@components/admin/user/models";

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

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface EmailValidationRequest{
    email: string
    is_a_new_user: boolean
}

export interface OtpVerificationRequest{
    email_or_phone: string
    otp: string
}

export interface RecoverPasswordPayload {
  token: string;
  new_password: string;
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
  phone?: string;
  phone_ext?: string;
  email: string;
  user_type: string;
  personas?: UserPersona[];
  last_active_date?: Date;

  has_profile_picture?: boolean;
  has_selfie_picture?: boolean;
  phone_validated?: boolean;
  email_validated?: boolean;
  languages?: string[];
  bvn_validated?: boolean;
  identity_validated?: boolean;
  address_validated?: boolean;
  driver_id?: string;
  wallet_id?: string;
  profile_id?: string;
  host_id?: string;
  escrow_id?: string;
  lien_id?: string;
  inbox_id?: string;
}

