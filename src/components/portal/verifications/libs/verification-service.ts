import {
  QueryVerificationDto,
  QueryVerificationTierDto,
  SearchVerificationDto,
  SearchVerificationTierDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryVerificationDetailDto } from "../details/models";
import { SuccessResponse } from "@components/admin/user/models";

export class VerificationService {
  verificationBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.verificationBaseUrl = "/verifications";
  }

  async createVerification(
      payload: FormData
  ): Promise<SuccessResponse<QueryVerificationDto>> {
      return await this.http.post<FormData>(
        `${this.verificationBaseUrl}`,
        payload
      );
  }

  async updateVerification(
      verificationId: string,
      payload: FormData
  ): Promise<SuccessResponse<QueryVerificationDto>> {
      return await this.http.put<FormData>(
        `${this.verificationBaseUrl}/${verificationId}`,
        payload
      );
  }

  async searchVerificationPage(
    payload: SearchVerificationDto
  ): Promise<Page<QueryVerificationDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryVerificationDto>>(
      `${this.verificationBaseUrl}?${query}`
    );
  }

  async getVerificationTierPage(
      payload: SearchVerificationTierDto
    ): Promise<Page<QueryVerificationTierDto>> {
      const query = toQueryParams(payload);
      return await this.http.get<Page<QueryVerificationTierDto>>(
        `${this.verificationBaseUrl}/tiers?${query}`
      );
  }

  async getVerificationDetail(
      refId: string
    ): Promise<SuccessResponse<QueryVerificationDetailDto>> {
      return await this.http.get<SuccessResponse<QueryVerificationDetailDto>>(
        `${this.verificationBaseUrl}/${refId}`
      );
    }
}
