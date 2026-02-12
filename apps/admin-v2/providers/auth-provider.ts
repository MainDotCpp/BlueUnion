'use client';

import { AuthProvider } from '@refinedev/core';
import {
  login,
  logout,
  check,
  getIdentity,
  register,
} from '@/app/actions/auth';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const result = await login({ username, password });
    if (result.success) {
      return {
        success: true,
        redirectTo: result.redirectTo,
      };
    }
    return {
      success: false,
      error: {
        name: 'LoginError',
        message: result.error?.message || 'Invalid credentials',
      },
    };
  },

  logout: async () => {
    const result = await logout();
    return {
      success: true,
      redirectTo: result.redirectTo,
    };
  },

  check: async () => {
    const result = await check();
    return {
      authenticated: result.authenticated,
      redirectTo: result.authenticated ? undefined : '/login',
    };
  },

  getIdentity: async () => {
    const user = await getIdentity();
    return user;
  },

  onError: async (error) => {
    if (error?.status === 401) {
      return {
        logout: true,
        redirectTo: '/login',
      };
    }
    return {};
  },

  register: async ({ email, password }) => {
    const result = await register({ email, password });
    if (result.success) {
      return {
        success: true,
        redirectTo: result.redirectTo,
      };
    }
    return {
      success: false,
      error: {
        name: 'RegisterError',
        message: result.error?.message || 'Registration failed',
      },
    };
  },
};
