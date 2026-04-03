import { QueryRoleDto, SearchRoleDto, CreateRoleDto, UpdateRoleDto, UpdateSystemRolesDto } from "../models";
import { Page, SuccessResponse } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class RoleService {
  roleBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.roleBaseUrl = "/users/roles";
  }

  async createRole(payload: CreateRoleDto): Promise<SuccessResponse<QueryRoleDto>> {
    return await this.http.post<CreateRoleDto, SuccessResponse<QueryRoleDto>>(
      `${this.roleBaseUrl}`,
      payload
    );
  }

  async getRole(roleId: string): Promise<SuccessResponse<QueryRoleDto>> {
    return this.http.get<SuccessResponse<QueryRoleDto>>(
      `${this.roleBaseUrl}/${roleId}`,
    );
  }

  async searchRolePage(payload: SearchRoleDto): Promise<Page<QueryRoleDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryRoleDto>>(
      `${this.roleBaseUrl}?${query}`
    );
  }

  async updateRole(roleId: string, payload: UpdateRoleDto): Promise<SuccessResponse<QueryRoleDto>> {
    return this.http.put<UpdateRoleDto, SuccessResponse<QueryRoleDto>>(
      `${this.roleBaseUrl}/${roleId}`,
      payload
    );
  }

  async updateSystemRoles(roleId: string, updateDto: UpdateSystemRolesDto): Promise<boolean> {
    return this.http.patch<UpdateSystemRolesDto, boolean>(
      `${this.roleBaseUrl}/${roleId}/system-roles`,
      updateDto
    );
  }

  async deactivateRole(roleId: string): Promise<boolean> {
    return this.http.patch<boolean>(
      `${this.roleBaseUrl}/${roleId}/deactivate`
    );
  }

  async activateRole(roleId: string): Promise<boolean> {
    return this.http.patch<boolean>(
      `${this.roleBaseUrl}/${roleId}/activate`
    );
  }

  async deleteRole(roleId: string): Promise<SuccessResponse<QueryRoleDto>> {
    return this.http.delete<SuccessResponse<QueryRoleDto>>(`${this.roleBaseUrl}/${roleId}`);
  }
}
