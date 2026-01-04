import {
  QueryTransactionDto,
  SearchTransactionDto,
  TransactionStats,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class TransactionService {
  transaction_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.transaction_base_url = "/transactions";
  }

  async getTransactionStats(): Promise<TransactionStats> {
    return await this.http.get<TransactionStats>(
      `${this.transaction_base_url}/stats`
    );
  }

  async searchTransactionPage(
    payload: SearchTransactionDto
  ): Promise<Page<QueryTransactionDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryTransactionDto>>(
      `${this.transaction_base_url}?${query}`
    );
  }
}
