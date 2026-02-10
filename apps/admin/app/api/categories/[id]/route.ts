import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories/[id]
 * 获取分类详情
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        categories: true, // 父分类
        other_categories: true, // 子分类
        _count: {
          select: {
            products: true,
            other_categories: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: '分类不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { success: false, error: '获取分类详情失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * 更新分类
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 检查分类是否存在
    const existing = await prisma.categories.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '分类不存在' },
        { status: 404 }
      );
    }

    // 如果修改了 slug，检查是否与其他分类冲突
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.categories.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'URL slug 已存在' },
          { status: 400 }
        );
      }
    }

    // 如果设置了父分类，检查是否会造成循环引用
    if (body.parentId) {
      if (body.parentId === id) {
        return NextResponse.json(
          { success: false, error: '不能将自己设为父分类' },
          { status: 400 }
        );
      }

      // 检查父分类是否存在
      const parent = await prisma.categories.findUnique({
        where: { id: body.parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { success: false, error: '父分类不存在' },
          { status: 400 }
        );
      }
    }

    // 更新分类
    const category = await prisma.categories.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        categories: true,
        _count: {
          select: {
            products: true,
            other_categories: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: '更新分类失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * 删除分类
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查分类是否存在
    const existing = await prisma.categories.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            other_categories: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '分类不存在' },
        { status: 404 }
      );
    }

    // 检查是否有子分类
    if (existing._count.other_categories > 0) {
      return NextResponse.json(
        { success: false, error: '该分类下还有子分类，无法删除' },
        { status: 400 }
      );
    }

    // 检查是否有产品
    if (existing._count.products > 0) {
      return NextResponse.json(
        { success: false, error: '该分类下还有产品，无法删除' },
        { status: 400 }
      );
    }

    // 删除分类
    await prisma.categories.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '分类已删除',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: '删除分类失败' },
      { status: 500 }
    );
  }
}
