'use client';

import { useList } from '@refinedev/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
            <span className="text-emerald-500">{trend}</span>
            <span className="ml-1">较上月</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: products } = useList({ resource: 'products' }) as any;
  const { data: orders } = useList({ resource: 'orders' }) as any;
  const { data: users } = useList({ resource: 'users' }) as any;
  const { data: inventory } = useList({ resource: 'inventory' }) as any;

  // Safe data access
  const orderList = (orders?.data as any[]) || [];

  // Calculate stats safely
  const totalSales =
    orderList.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) || 0;
  const orderCount = orderList.length || 0;
  const productCount = (products?.data as any[])?.length || 0;
  const userCount = (users?.data as any[])?.length || 0;

  // Find low stock items
  const lowStockItems =
    (inventory?.data as any[])?.filter((item: any) => item.quantity < 10) || [];

  const stats = [
    {
      title: '总销售额',
      value: `¥${totalSales.toLocaleString()}`,
      icon: <DollarSign className="h-4 w-4" />,
      trend: '+12.5%',
    },
    {
      title: '订单数',
      value: orderCount,
      icon: <ShoppingCart className="h-4 w-4" />,
      trend: '+8.2%',
    },
    {
      title: '产品数',
      value: productCount,
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: '用户数',
      value: userCount,
      icon: <Users className="h-4 w-4" />,
      trend: '+23.1%',
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">仪表盘</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderList.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.orderNo}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      ¥{Number(order.totalAmount || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {!orderList.length && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  暂无订单
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>库存预警</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.slice(0, 5).map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-destructive">库存不足</p>
                  </div>
                  <span className="text-sm font-medium text-destructive">
                    {item.quantity} 件
                  </span>
                </div>
              ))}
              {!lowStockItems.length && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  所有商品库存充足
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
