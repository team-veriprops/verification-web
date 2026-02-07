import {
  CreateVerificationDto,
  QueryVerificationDto,
  SearchVerificationDto,
  UpdateVerificationDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryVerificationDetailDto } from "../details/models";

export class VerificationService {
  verificationBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.verificationBaseUrl = "/verifications";
  }

  async createVerification(
      payload: CreateVerificationDto
  ): Promise<QueryVerificationDto> {
      return await this.http.post<CreateVerificationDto>(
        `${this.verificationBaseUrl}`,
        payload
      );
  }

  async updateVerification(
      verificationId: string,
      payload: UpdateVerificationDto
  ): Promise<QueryVerificationDto> {
      return await this.http.put<UpdateVerificationDto>(
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

  async getVerificationDetail(
      refId: string
    ): Promise<QueryVerificationDetailDto> {
      return await this.http.get<QueryVerificationDetailDto>(
        `${this.verificationBaseUrl}/${refId}`
      );
    }
}
