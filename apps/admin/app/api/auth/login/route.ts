import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { generateJWT, generateRefreshToken } from '@/lib/auth/jwt';
import { z } from 'zod';

// 登录请求验证 Schema
const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

/**
 * POST /api/auth/login
 * 用户登录
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 验证请求参数
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // 查询用户 (注意:表名是 users,关系字段是 roles)
    const user = await prisma.users.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: '账号已被禁用' },
        { status: 403 }
      );
    }

    // 生成 Token
    const payload = {
      userId: user.id,
      username: user.username,
      roleId: user.roleId,
    };

    const token = generateJWT(payload);
    const refreshToken = generateRefreshToken(payload);

    // 更新最后登录时间
    await prisma.users.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 返回响应
    return NextResponse.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          status: user.status,
          role: {
            id: user.roles.id,
            name: user.roles.name,
            code: user.roles.code,
          },
          permissions: user.roles.permissions.map(
            (p) => `${p.resource}:${p.action}`
          ),
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
