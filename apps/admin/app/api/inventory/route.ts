import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/inventory
 * 获取库存列表（支持按产品筛选）
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (status) {
      where.status = status;
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 获取库存统计
    const stats = await prisma.inventory.groupBy({
      by: ['status'],
      _count: true,
      where: productId ? { productId } : {},
    });

    return NextResponse.json({
      success: true,
      data: inventory,
      stats: stats.reduce((acc: any, stat: any) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { success: false, error: '获取库存失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory
 * 批量导入库存（纯文本卡密）
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, items } = body;

    if (!productId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: '请提供产品ID和库存数据' },
        { status: 400 }
      );
    }

    // 验证产品是否存在
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '产品不存在' },
        { status: 404 }
      );
    }

    // 生成批次号
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 批量创建库存（纯文本存储在 cardNumber 字段）
    const inventoryData = items.map((item: string, index: number) => ({
      id: `inv_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      cardNumber: item.trim(), // 纯文本卡密
      cardPassword: null,
      accountInfo: null,
      status: 'AVAILABLE',
      batchId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await prisma.inventory.createMany({
      data: inventoryData,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        count: result.count,
        batchId,
      },
      message: `成功导入 ${result.count} 条库存记录`,
    });
  } catch (error) {
    console.error('Import inventory error:', error);
    return NextResponse.json(
      { success: false, error: '导入库存失败' },
      { status: 500 }
    );
  }
}
