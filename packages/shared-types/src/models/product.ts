// 商品相关类型
import { ProductStatus, StockType } from '@blueunion/database';

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  status: ProductStatus;
  featured: boolean;
  sort: number;
  stockType: StockType;
  autoDeliver: boolean;
  salesCount: number;
  viewCount: number;
  availableStock?: number; // 可用库存数量
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  status?: ProductStatus;
  featured?: boolean;
  sort?: number;
  stockType?: StockType;
  autoDeliver?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  categoryId?: string;
  status?: ProductStatus;
  featured?: boolean;
  sort?: number;
  stockType?: StockType;
  autoDeliver?: boolean;
}
