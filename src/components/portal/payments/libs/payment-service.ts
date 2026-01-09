import {
  QueryPaymentDto,
  SearchPaymentDto,
  PaymentStats,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryPaymentDetailDto } from "../details/models";

export class PaymentService {
  payment_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.payment_base_url = "/payments";
  }

  async getPaymentStats(): Promise<PaymentStats> {
    return await this.http.get<PaymentStats>(
      `${this.payment_base_url}/stats`
    );
  }

  async searchPaymentPage(
    payload: SearchPaymentDto
  ): Promise<Page<QueryPaymentDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryPaymentDto>>(
      `${this.payment_base_url}?${query}`
    );
  }

  async getPaymentDetail(
      ref_id: string
    ): Promise<QueryPaymentDetailDto> {
      return await this.http.get<QueryPaymentDetailDto>(
        `${this.payment_base_url}/${ref_id}`
      );
    }
}
