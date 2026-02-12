'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTable } from '@refinedev/core';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Suspense } from 'react';

function InventoryListContent() {
  const {
    tableQueryResult,
    pageSize,
    current,
    setCurrent,
    setPageSize,
    sorters,
    setSorters,
  } = useTable({
    resource: 'inventory',
    pagination: {
      mode: 'server',
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },
    // We might need to include 'products' to show product name
    // Refine/Prisma integration usually needs nested include if supported by data provider
    // Our simple data provider might not support relational includes yet.
    // If product name is missing, we might see IDs only.
  }) as any;

  const data = tableQueryResult?.data?.data ?? [];
  const total = tableQueryResult?.data?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize);

  const toggleSort = (field: string) => {
    setSorters([
      {
        field,
        order:
          sorters.find((s: any) => s.field === field)?.order === 'asc'
            ? 'desc'
            : 'asc',
      },
    ]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-500">可用</Badge>;
      case 'SOLD':
        return <Badge className="bg-blue-500">已售</Badge>;
      case 'RESERVED':
        return <Badge className="bg-yellow-500">保留</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">过期</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">库存管理</h2>
        {/* Bulk import would go here */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>库存列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>产品ID</TableHead>
                  <TableHead>卡密/账号</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('createdAt')}
                      className="-ml-4"
                    >
                      入库时间
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableQueryResult.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">
                        {item.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.productId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {item.cardNumber && (
                            <span>卡号: {item.cardNumber}</span>
                          )}
                          {/* Mask password for security */}
                          {item.cardPassword && (
                            <span className="text-muted-foreground text-xs">
                              密码: ******
                            </span>
                          )}
                          {!item.cardNumber && !item.cardPassword && (
                            <span className="text-muted-foreground">
                              无详细信息
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm', {
                          locale: zhCN,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              共 {total} 条记录
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrent(current - 1)}
              disabled={current <= 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrent(current + 1)}
              disabled={current >= pageCount}
            >
              下一页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InventoryList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryListContent />
    </Suspense>
  );
}
