import { NextRequest } from 'next/server';
import { withAuth, successResponse } from '@/lib/api/middleware';

/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 */
export const GET = withAuth(async (req: NextRequest, context) => {
  const { user } = context;

  return successResponse({
    id: user.id,
    username: user.username,
    roleId: user.roleId,
    permissions: user.permissions,
  });
});
