import {
  DashboardStats,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";
import { QueryVerificationDto, SearchVerificationDto } from "@components/portal/verifications/models";

export class DashboardService {
  dashboard_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.dashboard_base_url = "/dashboard";
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return await this.http.get<DashboardStats>(
      `${this.dashboard_base_url}/stats`
    );
  }

  async getRecentVerificationActivities(
      payload: SearchVerificationDto
    ): Promise<Page<QueryVerificationDto>> {
      const query = toQueryParams(payload);
      return await this.http.get<Page<QueryVerificationDto>>(
        `${this.dashboard_base_url}/verification-activities?${query}`
      );
  }
}
