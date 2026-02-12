'use client';

import { useMenu, useLogout, useGetIdentity } from '@refinedev/core';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Folder,
  Package,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React, { Fragment, Suspense } from 'react';

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  products: ShoppingBag,
  categories: Folder,
  inventory: Package,
  orders: FileText,
  users: Users,
  settings: Settings,
};

function SidebarContent() {
  const { menuItems, selectedKey } = useMenu();

  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span className="">BlueUnion Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {menuItems.map((item) => {
            const Icon = item.meta?.icon
              ? iconMap[item.meta.icon as string]
              : LayoutDashboard;
            const isActive = selectedKey === item.key;

            return (
              <Link
                key={item.key}
                href={item.route ?? '/'}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block w-[240px] lg:w-[280px]">
      <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
        <SidebarContent />
      </Suspense>
    </div>
  );
}

function HeaderContent() {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity();
  const { menuItems } = useMenu();

  const currentItem =
    menuItems.find((item) => item.route === pathname) ||
    menuItems.find(
      (item) =>
        item.route && pathname.startsWith(item.route) && item.route !== '/'
    );

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">切换导航菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col w-[240px] sm:w-[300px] p-0"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarContent />
          </Suspense>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">首页</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentItem && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentItem.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() ?? 'AD'}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">用户菜单</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>我的账户</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>个人设置</DropdownMenuItem>
          <DropdownMenuItem>帮助中心</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-14 border-b bg-muted/40"></div>}>
      <HeaderContent />
    </Suspense>
  );
}
