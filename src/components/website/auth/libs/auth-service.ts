import { HttpClient } from "@lib/FetchHttpClient";
import { ActiveAuditor, ChangePasswordPayload, EmailValidationRequest, InitSocialLoginResponse, LoginPayload, OtpVerificationRequest, ProfileResponse, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";
import { CreateUserDto, LoginSuccessDto, SuccessResponse } from "../../../admin/user/models";
import { toQueryParams } from "@lib/utils";

export class AuthService {
  private readonly authBaseUrl = "/users";

  constructor(private readonly http: HttpClient) {}

  initSocialAuth(
    provider: SocialAuthProvider,
    authType: SocialAuthType
  ): Promise<InitSocialLoginResponse> {
    const params = { operation_type: authType };
    const query = toQueryParams(params);
    return this.http.get<InitSocialLoginResponse>(
      `${this.authBaseUrl}/auths/socials/${provider}/init?${query}`
    );
  }

  createUser(payload: CreateUserDto): Promise<LoginSuccessDto> {
    return this.http.post<CreateUserDto, LoginSuccessDto>(
      `${this.authBaseUrl}`,
      payload
    );
  }

  login(payload: LoginPayload): Promise<LoginSuccessDto> {
    return this.http.post<LoginPayload, LoginSuccessDto>(
      `${this.authBaseUrl}/auths/login`,
      payload
    );
  }

  getProfile(): Promise<SuccessResponse<ActiveAuditor>> {
    return this.http.get<SuccessResponse<ActiveAuditor>>(`${this.authBaseUrl}/auths/profile`);
  }

  refreshToken(): Promise<void> {
    return this.http.post<void>(`${this.authBaseUrl}/auths/refresh-token`);
  }

  logout(): Promise<boolean> {
    return this.http.post<null, boolean>(`${this.authBaseUrl}/auths/logout`);
  }

  changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    return this.http.patch<ChangePasswordPayload, boolean>(
      `${this.authBaseUrl}/auths/change-password`,
      payload
    );
  }

  sendRecoverPasswordMessage(
    payload: RecoverPasswordMessagePayload
  ): Promise<boolean> {
    return this.http.post<RecoverPasswordMessagePayload, boolean>(
      `${this.authBaseUrl}/auths/recover-password/message`,
      payload
    );
  }

  sendEmailValidationMessage(
    payload: EmailValidationRequest
  ): Promise<boolean> {
    return this.http.post<EmailValidationRequest, boolean>(
      `${this.authBaseUrl}/send-email-validation-message`,
      payload
    );
  }

  validateEmailVerificationOtp(
    payload: OtpVerificationRequest
  ): Promise<boolean> {
    return this.http.post<OtpVerificationRequest, boolean>(
      `${this.authBaseUrl}/validate-email-otp`,
      payload
    );
  }

  recoverPassword(payload: RecoverPasswordPayload): Promise<boolean> {
    return this.http.post<RecoverPasswordPayload, boolean>(
      `${this.authBaseUrl}/auths/recover-password`,
      payload
    );
  }
}
