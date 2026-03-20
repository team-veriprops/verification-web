import { HttpClient } from "@lib/FetchHttpClient";
import { ActiveAuditor, ChangePasswordPayload, VerificationRequestDto, InitSocialLoginResponse, LoginPayload, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../../../website/auth/models";
import { CreateInvitedUserDto, CreateUserDto, QueryInvitedUserDto, QueryUserDto, SearchInvitedUserDto, SearchUserDto } from "../models";
import { toQueryParams } from "@lib/utils";
import { Page, SuccessResponse } from "types/models";

export class UserService {
  private readonly authBaseUrl = "/users";

  constructor(private readonly http: HttpClient) {}

  async createUser(payload: CreateUserDto): Promise<ActiveAuditor> {
    return this.http.post<CreateUserDto, ActiveAuditor>(
      `${this.authBaseUrl}`,
      payload
    );
  }

  async initSocialAuth(
    provider: SocialAuthProvider,
    authType: SocialAuthType
  ): Promise<InitSocialLoginResponse> {
    const params = { operation_type: authType };
    const query = toQueryParams(params);
    return this.http.get<InitSocialLoginResponse>(
      `${this.authBaseUrl}/auth/oauth/${provider}/init?${query}`
    );
  }

  async login(payload: LoginPayload): Promise<ActiveAuditor> {
    return this.http.post<LoginPayload, ActiveAuditor>(
      `${this.authBaseUrl}/auth/sessions`,
      payload
    );
  }

  async refreshToken(): Promise<void> {
    return this.http.post<void>(`${this.authBaseUrl}/auth/sessions/current`);
  }

  async logout(): Promise<boolean> {
    return this.http.delete<boolean>(`${this.authBaseUrl}/auth/sessions/current`);
  }

  async changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    return this.http.patch<ChangePasswordPayload, boolean>(
      `${this.authBaseUrl}/auth/change-password`,
      payload
    );
  }

  async sendRecoverPasswordMessage(
    payload: RecoverPasswordMessagePayload
  ): Promise<boolean> {
    return this.http.post<RecoverPasswordMessagePayload, boolean>(
      `${this.authBaseUrl}/auth/password-resets/requests`,
      payload
    );
  }

  async recoverPassword(payload: RecoverPasswordPayload): Promise<boolean> {
    return this.http.post<RecoverPasswordPayload, boolean>(
      `${this.authBaseUrl}/auth/password-resets`,
      payload
    );
  }

  async getProfile(): Promise<SuccessResponse<ActiveAuditor>> {
    return this.http.get<SuccessResponse<ActiveAuditor>>(`${this.authBaseUrl}/me`);
  }

  async sendEmailVerificationMessage(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/email`,
      payload
    );
  }

  async validateEmailVerificationOtp(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/email/confirm`,
      payload
    );
  }

  async sendPhoneVerificationMessage(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/phone`,
      payload
    );
  }

  async validatePhoneVerificationOtp(
    payload: VerificationRequestDto
  ): Promise<boolean> {
    return this.http.post<VerificationRequestDto, boolean>(
      `${this.authBaseUrl}/me/verifications/phone/confirm`,
      payload
    );
  }

  async searchUserPage(payload: SearchUserDto): Promise<Page<QueryUserDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryUserDto>>(
      `${this.authBaseUrl}?${query}`
    );
  }

  // Invites
  async inviteNormalUser(payload: CreateInvitedUserDto): Promise<SuccessResponse<QueryInvitedUserDto>> {
    return this.http.post<CreateInvitedUserDto, SuccessResponse<QueryInvitedUserDto>>(
      `${this.authBaseUrl}/invites`,
      payload
    );
  }
  async inviteAdminUser(payload: CreateInvitedUserDto): Promise<SuccessResponse<QueryInvitedUserDto>> {
    return this.http.post<CreateInvitedUserDto, SuccessResponse<QueryInvitedUserDto>>(
      `${this.authBaseUrl}/invites/admin`,
      payload
    );
  }
  
  async reInviteUser(inviteId: string): Promise<SuccessResponse<QueryInvitedUserDto>> {
    return this.http.post<SuccessResponse<QueryInvitedUserDto>>(
      `${this.authBaseUrl}/invites/${inviteId}/reinvite`,
    );
  }
  
  async getInviteUser(inviteId: string): Promise<SuccessResponse<QueryInvitedUserDto>> {
    return this.http.get<SuccessResponse<QueryInvitedUserDto>>(
      `${this.authBaseUrl}/invites/${inviteId}`,
    );
  }

  async searchInvitedUserPage(payload: SearchInvitedUserDto): Promise<Page<QueryInvitedUserDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryInvitedUserDto>>(
      `${this.authBaseUrl}/invites?${query}`
    );
  }

}
