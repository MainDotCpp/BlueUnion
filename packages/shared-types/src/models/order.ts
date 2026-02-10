// 订单相关类型
import { OrderStatus, PaymentStatus } from '@blueunion/database';

export interface OrderItemDTO {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderDTO {
  id: string;
  orderNo: string;
  userId?: string;
  buyerEmail?: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;
  deliveredAt?: Date;
  deliveryInfo?: any;
  refundAmount?: number;
  refundReason?: string;
  refundAt?: Date;
  orderItems: OrderItemDTO[];
  inventory?: Array<{
    id: string;
    cardNumber?: string;
    cardPassword?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundOrderInput {
  orderId: string;
  reason: string;
  amount?: number; // 如果不提供，则全额退款
}
