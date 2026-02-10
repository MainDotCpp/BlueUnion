import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products/[id]
 * 获取产品详情
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
        inventory: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '产品不存在' },
        { status: 404 }
      );
    }

    // 统计库存
    const inventoryStats = {
      total: product.inventory.length,
      available: product.inventory.filter(i => i.status === 'AVAILABLE').length,
      sold: product.inventory.filter(i => i.status === 'SOLD').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        inventoryStats,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { success: false, error: '获取产品详情失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * 更新产品
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 检查产品是否存在
    const existing = await prisma.products.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '产品不存在' },
        { status: 404 }
      );
    }

    // 如果修改了 slug，检查是否与其他产品冲突
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.products.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'URL slug 已存在' },
          { status: 400 }
        );
      }
    }

    // 更新产品
    const product = await prisma.products.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: '更新产品失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * 删除产品
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查产品是否存在
    const existing = await prisma.products.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '产品不存在' },
        { status: 404 }
      );
    }

    // 删除产品（级联删除相关库存）
    await prisma.products.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: '产品已删除',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: '删除产品失败' },
      { status: 500 }
    );
  }
}
