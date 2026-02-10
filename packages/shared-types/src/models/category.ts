// 分类相关类型
import { CategoryStatus } from '@blueunion/database';

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort: number;
  status: CategoryStatus;
  parentId?: string;
  parent?: CategoryDTO;
  children?: CategoryDTO[];
  productCount?: number; // 商品数量
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort?: number;
  status?: CategoryStatus;
  parentId?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  sort?: number;
  status?: CategoryStatus;
  parentId?: string;
}
