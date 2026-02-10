import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, type JWTPayload } from '@/lib/auth/jwt';
import { prisma } from '@blueunion/database';

export interface AuthContext {
  user: {
    id: string;
    username: string;
    roleId: string;
    permissions: string[];
  };
}

type AuthHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<NextResponse> | NextResponse;

interface WithAuthOptions {
  requiredPermissions?: string[];
}

/**
 * API 认证中间件
 * 验证 JWT Token 并检查权限
 */
export function withAuth(
  handler: AuthHandler,
  options?: WithAuthOptions
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      // 1. 从 Header 中获取 Token
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, error: '未提供认证令牌' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // 2. 验证 JWT
      let payload: JWTPayload;
      try {
        payload = verifyJWT(token);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: '认证令牌无效或已过期' },
          { status: 401 }
        );
      }

      // 3. 查询用户及权限
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: '用户不存在' },
          { status: 401 }
        );
      }

      if (user.status !== 'ACTIVE') {
        return NextResponse.json(
          { success: false, error: '用户已被禁用' },
          { status: 403 }
        );
      }

      // 4. 权限检查
      const userPermissions = user.role.permissions.map(
        (p) => `${p.resource}:${p.action}`
      );

      if (options?.requiredPermissions) {
        const hasPermission = options.requiredPermissions.every((p) =>
          userPermissions.includes(p)
        );

        if (!hasPermission) {
          return NextResponse.json(
            { success: false, error: '权限不足' },
            { status: 403 }
          );
        }
      }

      // 5. 构造上下文并执行处理器
      const context: AuthContext = {
        user: {
          id: user.id,
          username: user.username,
          roleId: user.roleId,
          permissions: userPermissions,
        },
      };

      return await handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: '服务器内部错误' },
        { status: 500 }
      );
    }
  };
}

/**
 * 简单的错误响应
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * 成功响应
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}
