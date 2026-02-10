import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products
 * 获取产品列表
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 查询总数
    const total = await prisma.products.count({ where });

    // 查询数据
    const products = await prisma.products.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: '获取产品列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * 创建新产品
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      image,
      price,
      originalPrice,
      categoryId,
      status = 'DRAFT',
      featured = false,
      sort = 0,
      stockType = 'CARD',
      autoDeliver = true,
    } = body;

    // 验证必填字段
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existing = await prisma.products.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'URL slug 已存在' },
        { status: 400 }
      );
    }

    // 创建产品
    const product = await prisma.products.create({
      data: {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        slug,
        description,
        image,
        price,
        originalPrice,
        categoryId,
        status,
        featured,
        sort,
        stockType,
        autoDeliver,
        createdAt: new Date(),
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
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: '创建产品失败' },
      { status: 500 }
    );
  }
}
