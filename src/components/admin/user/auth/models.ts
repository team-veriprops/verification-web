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
