/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface RoleBaseDto {}

// Create DTO
export interface CreateRoleDto extends RoleBaseDto {
  name: string;
  description: string;
  systemRoles: SystemRole[];
  companyId?: string
}

// Update DTO (full override)
export interface UpdateRoleDto extends RoleBaseDto {}

export interface SearchRoleDto extends PageRequest, BaseQueryDto {
    isSystemRole: boolean;
    companyId: string;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryRoleDto extends CreateRoleDto, BaseQueryDto {
  isSystemRole: boolean;
  isActive: boolean;
}  

export enum SystemRole {
  SUPER_USER = "SUPER_USER", // Account owner
  ADMIN = "ADMIN", // In a company
  ACCOUNTANT = "ACCOUNTANT", // In a company
  LEGAL = "LEGAL", // In a company
  AGENT = "AGENT", // In a company
  VIEWER = "VIEWER", // In a company
}

export interface UpdateSystemRolesDto {
  systemRoles: SystemRole[]
}
