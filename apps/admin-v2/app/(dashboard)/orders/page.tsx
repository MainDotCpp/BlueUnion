'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTable } from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Suspense } from 'react';

function OrdersPageContent() {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { result, current, setCurrent, pageSize, setFilters } = useTable({
    resource: 'orders',
    syncWithLocation: true,
    filters: {
      initial: statusFilter
        ? [{ field: 'status', operator: 'eq', value: statusFilter }]
        : [],
    },
    pagination: { mode: 'server' },
  }) as any;

  const { data, isLoading } = result || {};

  const handleStatusFilter = (status: string) => {
    if (status === statusFilter) {
      setStatusFilter('');
      setFilters([]);
    } else {
      setStatusFilter(status);
      setFilters([{ field: 'status', operator: 'eq', value: status }]);
    }
  };

  const handleRefund = (orderId: string) => {
    console.log('Refund order:', orderId);
  };

  const total = data?.total || 0;

  const statusMap: Record<string, string> = {
    pending: '待处理',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    refunded: '已退款',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">订单管理</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索订单号..."
                className="pl-9"
                onChange={(e) =>
                  setFilters([
                    {
                      field: 'orderNo',
                      operator: 'contains',
                      value: e.target.value,
                    },
                  ])
                }
              />
            </div>
            <div className="flex gap-2">
              {['pending', 'paid', 'shipped', 'completed', 'refunded'].map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter(status)}
                    className="capitalize"
                  >
                    {statusMap[status] || status}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      暂无订单
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNo}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>¥{order.totalAmount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'refunded'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="capitalize"
                        >
                          {statusMap[order.status] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status !== 'refunded' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRefund(order.id)}
                            >
                              退款
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              显示 {(current - 1) * pageSize + 1} 至{' '}
              {Math.min(current * pageSize, total)} 共 {total} 条结果
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent(current - 1)}
                disabled={current === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent(current + 1)}
                disabled={current * pageSize >= total}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
