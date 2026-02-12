'use client';

import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { dataProvider } from '@/providers/data-provider';
import { authProvider } from '@/providers/auth-provider';
import { notificationProvider } from '@/providers/notification-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      routerProvider={routerProvider}
      notificationProvider={notificationProvider}
      resources={[
        {
          name: 'dashboard',
          list: '/dashboard',
          meta: { label: '仪表盘', icon: 'dashboard' },
        },
        {
          name: 'products',
          list: '/products',
          create: '/products/create',
          edit: '/products/edit/:id',
          show: '/products/show/:id',
          meta: { label: '产品管理', icon: 'shopping' },
        },
        {
          name: 'categories',
          list: '/categories',
          create: '/categories/create',
          edit: '/categories/edit/:id',
          meta: { label: '分类管理', icon: 'folder' },
        },
        {
          name: 'inventory',
          list: '/inventory',
          meta: { label: '库存管理', icon: 'package' },
        },
        {
          name: 'orders',
          list: '/orders',
          show: '/orders/show/:id',
          meta: { label: '订单管理', icon: 'file-text' },
        },
        {
          name: 'users',
          list: '/users',
          create: '/users/create',
          edit: '/users/edit/:id',
          meta: { label: '用户管理', icon: 'users' },
        },
        {
          name: 'settings',
          list: '/settings',
          meta: { label: '系统设置', icon: 'settings' },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
}
