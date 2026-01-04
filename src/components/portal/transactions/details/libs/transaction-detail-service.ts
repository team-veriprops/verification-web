import { QueryTransactionDetailDto } from "../models";
import { HttpClient } from "@lib/FetchHttpClient";

export class TransactionDetailService {
  transaction_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.transaction_base_url = "/transactions";
  }

  async getTransactionDetail(
    ref_id: string
  ): Promise<QueryTransactionDetailDto> {
    return await this.http.get<QueryTransactionDetailDto>(
      `${this.transaction_base_url}/${ref_id}`
    );
  }
}
