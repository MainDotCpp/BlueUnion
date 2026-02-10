import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories
 * 获取分类列表
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // 默认返回所有分类
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (status) where.status = status;

    // 查询总数
    const total = await prisma.categories.count({ where });

    // 查询数据
    const categories = await prisma.categories.findMany({
      where,
      include: {
        categories: true, // 父分类
        _count: {
          select: {
            products: true, // 产品数量
            other_categories: true, // 子分类数量
          },
        },
      },
      orderBy: {
        sort: 'asc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: categories,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: '获取分类列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * 创建新分类
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      icon,
      sort = 0,
      status = 'ACTIVE',
      parentId,
    } = body;

    // 验证必填字段
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existing = await prisma.categories.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'URL slug 已存在' },
        { status: 400 }
      );
    }

    // 创建分类
    const category = await prisma.categories.create({
      data: {
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        slug,
        description,
        icon,
        sort,
        status,
        parentId,
        createdAt: new Date(),
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
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, error: '创建分类失败' },
      { status: 500 }
    );
  }
}
