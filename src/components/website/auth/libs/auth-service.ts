import { HttpClient } from "@lib/FetchHttpClient";
import { ActiveAuditor, ChangePasswordPayload, EmailValidationRequest, InitSocialLoginResponse, LoginPayload, OtpVerificationRequest, ProfileResponse, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";
import { CreateUserDto, LoginSuccessDto, SuccessResponse } from "../../../admin/user/models";
import { toQueryParams } from "@lib/utils";

export class AuthService {
  private readonly auth_base_url = "/users";

  constructor(private readonly http: HttpClient) {}

  initSocialAuth(
    provider: SocialAuthProvider,
    authType: SocialAuthType
  ): Promise<InitSocialLoginResponse> {
    const params = { operation_type: authType };
    const query = toQueryParams(params);
    return this.http.get<InitSocialLoginResponse>(
      `${this.auth_base_url}/auths/socials/${provider}/init?${query}`
    );
  }

  createUser(payload: CreateUserDto): Promise<LoginSuccessDto> {
    return this.http.post<CreateUserDto, LoginSuccessDto>(
      `${this.auth_base_url}`,
      payload
    );
  }

  login(payload: LoginPayload): Promise<LoginSuccessDto> {
    return this.http.post<LoginPayload, LoginSuccessDto>(
      `${this.auth_base_url}/auths/login`,
      payload
    );
  }

  getProfile(): Promise<SuccessResponse<ActiveAuditor>> {
    return this.http.get<SuccessResponse<ActiveAuditor>>(`${this.auth_base_url}/auths/profile`);
  }

  refreshToken(): Promise<void> {
    return this.http.post<void>(`${this.auth_base_url}/auths/refresh-token`);
  }

  logout(): Promise<boolean> {
    return this.http.post<null, boolean>(`${this.auth_base_url}/auths/logout`);
  }

  changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    return this.http.patch<ChangePasswordPayload, boolean>(
      `${this.auth_base_url}/auths/change-password`,
      payload
    );
  }

  sendRecoverPasswordMessage(
    payload: RecoverPasswordMessagePayload
  ): Promise<boolean> {
    return this.http.post<RecoverPasswordMessagePayload, boolean>(
      `${this.auth_base_url}/auths/recover-password/message`,
      payload
    );
  }

  sendEmailValidationMessage(
    payload: EmailValidationRequest
  ): Promise<boolean> {
    return this.http.post<EmailValidationRequest, boolean>(
      `${this.auth_base_url}/send-email-validation-message`,
      payload
    );
  }

  validateEmailVerificationOtp(
    payload: OtpVerificationRequest
  ): Promise<boolean> {
    return this.http.post<OtpVerificationRequest, boolean>(
      `${this.auth_base_url}/validate-email-otp`,
      payload
    );
  }

  recoverPassword(payload: RecoverPasswordPayload): Promise<boolean> {
    return this.http.post<RecoverPasswordPayload, boolean>(
      `${this.auth_base_url}/auths/recover-password`,
      payload
    );
  }
}
