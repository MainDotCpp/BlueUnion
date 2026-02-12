'use server';

import prisma from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'auth_token';

export const login = async ({ username, password }: any) => {
  try {
    const user = await prisma.users.findFirst({
      where: { username },
      include: { roles: true },
    });

    if (!user) {
      return {
        success: false,
        error: { message: 'Invalid credentials' },
      };
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return {
        success: false,
        error: { message: 'Invalid credentials' },
      };
    }

    // In a real app, generate a real JWT here.
    // For now, we'll create a simple session object.
    const token = JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.roles?.code,
    });

    // Set HTTP-only cookie for server-side persistence
    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      redirectTo: '/dashboard',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: { message: 'Login failed' },
    };
  }
};

export const register = async ({ email, password }: any) => {
  try {
    const exists = await prisma.users.findFirst({ where: { email } });
    if (exists) {
      return {
        success: false,
        error: { message: 'User already exists' },
      };
    }

    const hashedPassword = await hash(password, 10);
    // Determine default role (assuming there's a default role or ID logic)
    // For safety, we might fail if no role exists, or pick the first one.
    const defaultRole = await prisma.roles.findFirst();

    if (!defaultRole) {
      return {
        success: false,
        error: { message: 'System error: No roles defined' },
      };
    }

    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        username: email.split('@')[0], // Simple username generation
        password: hashedPassword,
        roleId: defaultRole.id,
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });

    return { success: true, redirectTo: '/login' };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: { message: 'Registration failed' },
    };
  }
};

export const logout = async () => {
  (await cookies()).delete(COOKIE_NAME);
  return { success: true, redirectTo: '/login' };
};

export const check = async () => {
  const token = (await cookies()).get(COOKIE_NAME);
  return { authenticated: !!token };
};

export const getIdentity = async () => {
  const token = (await cookies()).get(COOKIE_NAME);
  if (!token) return null;

  try {
    const session = JSON.parse(token.value);
    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getPermissions = async () => {
  return null;
};
