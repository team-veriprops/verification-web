import { HttpClient } from "@lib/FetchHttpClient";
import { ActiveAuditor, ChangePasswordPayload, VerificationRequestDto, InitSocialLoginResponse, LoginPayload, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";
import { CreateUserDto, LoginSuccessDto, SuccessResponse } from "../../../admin/user/models";
import { toQueryParams } from "@lib/utils";

export class AuthService {
  private readonly authBaseUrl = "/users";

  constructor(private readonly http: HttpClient) {}

  createUser(payload: CreateUserDto): Promise<LoginSuccessDto> {
    return this.http.post<CreateUserDto, LoginSuccessDto>(
      `${this.authBaseUrl}`,
      payload
    );
  }

  initSocialAuth(
    provider: SocialAuthProvider,
    authType: SocialAuthType
  ): Promise<InitSocialLoginResponse> {
    const params = { operation_type: authType };
    const query = toQueryParams(params);
    return this.http.get<InitSocialLoginResponse>(
      `${this.authBaseUrl}/auth/oauth/${provider}/init?${query}`
    );
  }

  login(payload: LoginPayload): Promise<LoginSuccessDto> {
    return this.http.post<LoginPayload, LoginSuccessDto>(
      `${this.authBaseUrl}/auth/sessions`,
      payload
    );
  }

  refreshToken(): Promise<void> {
    return this.http.post<void>(`${this.authBaseUrl}/auth/sessions/current`);
  }

  logout(): Promise<boolean> {
    return this.http.delete<boolean>(`${this.authBaseUrl}/auth/sessions/current`);
  }

  changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    return this.http.patch<ChangePasswordPayload, boolean>(
      `${this.authBaseUrl}/auth/change-password`,
      payload
    );
  }

  sendRecoverPasswordMessage(
    payload: RecoverPasswordMessagePayload
  ): Promise<boolean> {
    return this.http.post<RecoverPasswordMessagePayload, boolean>(
      `${this.authBaseUrl}/auth/password-resets/requests`,
      payload
    );
  }

  recoverPassword(payload: RecoverPasswordPayload): Promise<boolean> {
    return this.http.post<RecoverPasswordPayload, boolean>(
      `${this.authBaseUrl}/auth/password-resets`,
      payload
    );
  }

  getProfile(): Promise<SuccessResponse<ActiveAuditor>> {
    return this.http.get<SuccessResponse<ActiveAuditor>>(`${this.authBaseUrl}/me`);
  }

  sendEmailVerificationMessage(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/email`,
      payload
    );
  }

  validateEmailVerificationOtp(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/email/confirm`,
      payload
    );
  }

  sendPhoneVerificationMessage(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/phone`,
      payload
    );
  }

  validatePhoneVerificationOtp(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/phone/confirm`,
      payload
    );
  }
}
