import { QueryRoleDto, SearchRoleDto, CreateRoleDto } from "../models";
import { Page } from "types/models";
import { buildPath, toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class RoleService {
  role_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.role_base_url = "/companies/{company_id}/roles";
  }

  async createRole(company_id: string, payload: CreateRoleDto): Promise<QueryRoleDto> {
    return await this.http.post<CreateRoleDto>(
      `${buildPath(this.role_base_url, {company_id})}`,
      payload
    );
  }

  async searchRolePage(company_id: string, payload: SearchRoleDto): Promise<Page<QueryRoleDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryRoleDto>>(
      `${buildPath(this.role_base_url, {company_id})}?${query}`
    );
  }
}
