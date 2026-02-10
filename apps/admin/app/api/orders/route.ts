import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/orders
 * 获取订单列表（支持搜索和筛选）
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const orderNo = searchParams.get('orderNo');
    const buyerEmail = searchParams.get('buyerEmail');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    const where: any = {};

    // 搜索条件
    if (orderNo) {
      where.orderNo = { contains: orderNo };
    }

    if (buyerEmail) {
      where.buyerEmail = { contains: buyerEmail };
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // 分页查询
    const skip = (page - 1) * pageSize;
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        include: {
          order_items: {
            include: {
              products: true,
            },
          },
          inventory: true,
          _count: {
            select: {
              order_items: true,
              inventory: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.orders.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: '获取订单列表失败' },
      { status: 500 }
    );
  }
}
