import { HttpClient } from "@lib/FetchHttpClient";
import { ChangePasswordPayload, InitSocialLoginResponse, LoginPayload, ProfileResponse, RecoverPasswordMessagePayload, RecoverPasswordPayload, SocialAuthProvider, SocialAuthType } from "../models";
import { LoginSuccessDto } from "../../models";
import { toQueryParams } from "@lib/utils";

export class AuthService {
  private readonly auth_base_url = "/users/auths";

  constructor(private readonly http: HttpClient) {}

  initSocialLogin(
    provider: SocialAuthProvider,
    authType: SocialAuthType
  ): Promise<InitSocialLoginResponse> {
    const params = { operation_type: authType };
    const query = toQueryParams(params);
    return this.http.get<InitSocialLoginResponse>(
      `${this.auth_base_url}/socials/${provider}/init?${query}`
    );
  }

  login(payload: LoginPayload): Promise<LoginSuccessDto> {
    return this.http.post<LoginPayload, LoginSuccessDto>(
      `${this.auth_base_url}/login`,
      payload
    );
  }

  getProfile(): Promise<LoginSuccessDto> {
    return this.http.get<LoginSuccessDto>(`${this.auth_base_url}/profile`);
  }

  refreshToken(): Promise<void> {
    return this.http.post<void>(`${this.auth_base_url}/refresh-token`);
  }

  logout(): Promise<boolean> {
    return this.http.post<null, boolean>(`${this.auth_base_url}/logout`);
  }

  changePassword(payload: ChangePasswordPayload): Promise<boolean> {
    return this.http.patch<ChangePasswordPayload, boolean>(
      `${this.auth_base_url}/change-password`,
      payload
    );
  }

  sendRecoverPasswordMessage(
    payload: RecoverPasswordMessagePayload
  ): Promise<boolean> {
    return this.http.post<RecoverPasswordMessagePayload, boolean>(
      `${this.auth_base_url}/recover-password/message`,
      payload
    );
  }

  recoverPassword(payload: RecoverPasswordPayload): Promise<boolean> {
    return this.http.post<RecoverPasswordPayload, boolean>(
      `${this.auth_base_url}/recover-password`,
      payload
    );
  }
}
