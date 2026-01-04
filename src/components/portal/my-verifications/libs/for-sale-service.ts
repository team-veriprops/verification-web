import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { CreateForSaleDto, QueryForSaleDto, SearchForSaleDto } from "../models";

export class ForSaleService {
  for_sale_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.for_sale_base_url = "/for_sales";
  }


  async createForSale(payload: CreateForSaleDto): Promise<QueryForSaleDto> {
    return await this.http.post<CreateForSaleDto>(
      `${this.for_sale_base_url}`,
      payload
    );
  }

  async searchForSalePage(
    payload: SearchForSaleDto
  ): Promise<Page<QueryForSaleDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryForSaleDto>>(
      `${this.for_sale_base_url}?${query}`
    );
  }
}
