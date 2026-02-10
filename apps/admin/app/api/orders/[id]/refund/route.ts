import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/orders/[id]/refund
 * 处理订单退款
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { refundAmount, refundReason } = body;

    // 检查订单是否存在
    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        inventory: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      );
    }

    // 检查订单状态
    if (order.status === 'REFUNDED') {
      return NextResponse.json(
        { success: false, error: '订单已退款' },
        { status: 400 }
      );
    }

    // 更新订单状态为已退款
    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        refundAmount: refundAmount || order.paidAmount,
        refundReason,
        refundAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 释放已售出的库存（将状态改回可用）
    if (order.inventory.length > 0) {
      await prisma.inventory.updateMany({
        where: {
          orderId: id,
          status: 'SOLD',
        },
        data: {
          status: 'AVAILABLE',
          orderId: null,
          soldAt: null,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: '退款成功',
    });
  } catch (error) {
    console.error('Refund order error:', error);
    return NextResponse.json(
      { success: false, error: '退款处理失败' },
      { status: 500 }
    );
  }
}
