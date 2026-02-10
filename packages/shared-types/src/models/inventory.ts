// 库存相关类型
import { InventoryStatus } from '@blueunion/database';

export interface InventoryDTO {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
  };
  cardNumber?: string;
  cardPassword?: string;
  accountInfo?: any;
  status: InventoryStatus;
  orderId?: string;
  soldAt?: Date;
  batchId?: string;
  importedBy?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryInput {
  productId: string;
  cardNumber?: string;
  cardPassword?: string;
  accountInfo?: any;
  expiresAt?: Date;
}

export interface BatchImportInventoryInput {
  productId: string;
  items: Array<{
    cardNumber?: string;
    cardPassword?: string;
    accountInfo?: any;
    expiresAt?: string;
  }>;
}

export interface InventoryImportResult {
  success: number;
  failed: number;
  batchId: string;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}
