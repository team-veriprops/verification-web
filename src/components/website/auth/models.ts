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
  oldPassword: string;
  newPassword: string;
}

export interface EmailValidationRequest{
    email: string
    isANewUser: boolean
}

export interface OtpVerificationRequest{
    emailOrPhone: string
    otp: string
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
  phone?: string;
  phoneExt?: string;
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

