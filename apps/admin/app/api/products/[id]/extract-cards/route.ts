import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/products/[id]/extract-cards
 * 管理员手动提卡（生成订单）
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await req.json();
    const { quantity, buyerEmail, note } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: '提卡数量必须大于0' },
        { status: 400 }
      );
    }

    // 检查产品是否存在
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '产品不存在' },
        { status: 404 }
      );
    }

    // 查询可用库存
    const availableInventory = await prisma.inventory.findMany({
      where: {
        productId,
        status: 'AVAILABLE',
      },
      take: quantity,
      orderBy: { createdAt: 'asc' }, // 先进先出
    });

    if (availableInventory.length < quantity) {
      return NextResponse.json(
        { success: false, error: `库存不足，当前可用: ${availableInventory.length}` },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderNo = `ADMIN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 创建订单
    const order = await prisma.orders.create({
      data: {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNo,
        buyerEmail: buyerEmail || 'admin@system.local',
        totalAmount: product.price.toNumber() * quantity,
        paidAmount: product.price.toNumber() * quantity,
        discountAmount: 0,
        status: 'DELIVERED', // 直接标记为已发货
        paymentStatus: 'PAID', // 直接标记为已支付
        paymentMethod: 'ADMIN_EXTRACT',
        paidAt: new Date(),
        deliveredAt: new Date(),
        deliveryInfo: {
          type: 'ADMIN_EXTRACT',
          note: note || '管理员手动提卡',
          extractedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 创建订单项
    await prisma.order_items.create({
      data: {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity,
        price: product.price,
        subtotal: product.price.toNumber() * quantity,
        createdAt: new Date(),
      },
    });

    // 更新库存状态为已售，并关联到订单
    const inventoryIds = availableInventory.map(inv => inv.id);
    await prisma.inventory.updateMany({
      where: {
        id: { in: inventoryIds },
      },
      data: {
        status: 'SOLD',
        orderId: order.id,
        soldAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 更新产品销量
    await prisma.products.update({
      where: { id: productId },
      data: {
        salesCount: { increment: quantity },
      },
    });

    // 获取提取的卡密详情
    const extractedCards = availableInventory.map(inv => ({
      id: inv.id,
      cardNumber: inv.cardNumber,
    }));

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNo: order.orderNo,
          totalAmount: order.totalAmount,
        },
        cards: extractedCards,
        quantity: extractedCards.length,
      },
      message: `成功提取 ${extractedCards.length} 个卡密`,
    });
  } catch (error) {
    console.error('Extract cards error:', error);
    return NextResponse.json(
      { success: false, error: '提卡失败' },
      { status: 500 }
    );
  }
}
