// 角色相关类型

export interface RoleDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions?: PermissionDTO[];
  userCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionDTO {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface CreateRoleInput {
  name: string;
  code: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: string[];
}
