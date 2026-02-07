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
  paymentBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.paymentBaseUrl = "/payments";
  }

  async getPaymentStats(): Promise<PaymentStats> {
    return await this.http.get<PaymentStats>(
      `${this.paymentBaseUrl}/stats`
    );
  }

  async searchPaymentPage(
    payload: SearchPaymentDto
  ): Promise<Page<QueryPaymentDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryPaymentDto>>(
      `${this.paymentBaseUrl}?${query}`
    );
  }

  async getPaymentDetail(
      refId: string
    ): Promise<QueryPaymentDetailDto> {
      return await this.http.get<QueryPaymentDetailDto>(
        `${this.paymentBaseUrl}/${refId}`
      );
    }
}
