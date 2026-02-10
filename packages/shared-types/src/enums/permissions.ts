// 权限枚举
export enum PermissionResource {
  PRODUCT = 'product',
  CATEGORY = 'category',
  INVENTORY = 'inventory',
  ORDER = 'order',
  USER = 'user',
  ROLE = 'role',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import',
  REFUND = 'refund',
}

export type Permission = `${PermissionResource}:${PermissionAction}`;
