/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface RoleBaseDto {}

// Create DTO
export interface CreateRoleDto extends RoleBaseDto {
  name: string;
  description: string;
  system_roles: string[];
  is_system_role?: boolean;
  status?: string;
}

// Update DTO (full override)
export interface UpdateRoleDto extends RoleBaseDto {}

export interface SearchRoleDto extends PageRequest, BaseQueryDto {
      is_system_role?: boolean;
      company_id: string;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryRoleDto extends CreateRoleDto, BaseQueryDto {
  
}  
