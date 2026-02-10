'use client';

import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { useNotificationProvider } from '@refinedev/antd';
import routerProvider from '@refinedev/nextjs-router';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { authProvider } from '@/lib/refine/auth-provider';
import { dataProvider } from '@/lib/refine/data-provider';
import { antdTheme } from './theme';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  InboxOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RefineKbarProvider>
      <ConfigProvider
        locale={zhCN}
        theme={antdTheme}
      >
        <AntdApp>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/dashboard',
                meta: {
                  label: '仪表盘',
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: 'products',
                list: '/products',
                create: '/products/create',
                edit: '/products/edit/:id',
                show: '/products/show/:id',
                meta: {
                  label: '产品管理',
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: 'categories',
                list: '/categories',
                create: '/categories/create',
                edit: '/categories/edit/:id',
                meta: {
                  label: '分类管理',
                  icon: <AppstoreOutlined />,
                },
              },
              {
                name: 'inventory',
                list: '/inventory',
                create: '/inventory/create',
                meta: {
                  label: '库存管理',
                  icon: <InboxOutlined />,
                },
              },
              {
                name: 'orders',
                list: '/orders',
                show: '/orders/show/:id',
                meta: {
                  label: '订单管理',
                  icon: <FileTextOutlined />,
                },
              },
              {
                name: 'users',
                list: '/users',
                create: '/users/create',
                edit: '/users/edit/:id',
                meta: {
                  label: '用户管理',
                  icon: <UserOutlined />,
                },
              },
              {
                name: 'settings',
                list: '/settings',
                meta: {
                  label: '系统设置',
                  icon: <SettingOutlined />,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: 'blueunion-admin',
            }}
          >
            {children}
            <RefineKbar />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </RefineKbarProvider>
  );
}
