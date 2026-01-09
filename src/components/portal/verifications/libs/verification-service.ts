import {
  QueryVerificationDto,
  SearchVerificationDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryVerificationDetailDto } from "../details/models";

export class VerificationService {
  verification_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.verification_base_url = "/verifications";
  }

  async searchVerificationPage(
    payload: SearchVerificationDto
  ): Promise<Page<QueryVerificationDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryVerificationDto>>(
      `${this.verification_base_url}?${query}`
    );
  }

  async getVerificationDetail(
      ref_id: string
    ): Promise<QueryVerificationDetailDto> {
      return await this.http.get<QueryVerificationDetailDto>(
        `${this.verification_base_url}/${ref_id}`
      );
    }
}
