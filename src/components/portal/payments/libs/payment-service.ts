import {
  QueryPaymentDto,
  SearchPaymentDto,
  PaymentStats,
  QueryPaymentCheckoutDto,
  QueryAvailablePaymentMethodDto,
  SearchAvailablePaymentMethodDto,
  QueryPaymentAuthorizationDto,
} from "../models";
import { Page, PaymentMethod } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryPaymentDetailDto } from "../details/models";
import { SuccessResponse } from "@components/admin/user/models";

export class PaymentService {
  paymentBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.paymentBaseUrl = "/payments";
  }

  async getPaymentCheckout(invoiceId: string): Promise<SuccessResponse<QueryPaymentCheckoutDto>> {
    return await this.http.get<SuccessResponse<QueryPaymentCheckoutDto>>(
      `${this.paymentBaseUrl}/${invoiceId}/checkout`
    );
  }

  async getPaymentAuthorization(invoiceId: string, paymentMethod: PaymentMethod): Promise<SuccessResponse<QueryPaymentAuthorizationDto>> {
    return await this.http.get<SuccessResponse<QueryPaymentAuthorizationDto>>(
      `${this.paymentBaseUrl}/${invoiceId}/authorize?payment_method=${paymentMethod}`
    );
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

  async searchAvailablePaymentMethodPage(
    payload: SearchAvailablePaymentMethodDto
  ): Promise<Page<QueryAvailablePaymentMethodDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryAvailablePaymentMethodDto>>(
      `${this.paymentBaseUrl}/available-methods?${query}`
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
