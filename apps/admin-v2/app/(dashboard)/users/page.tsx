'use client';

export const dynamic = 'force-dynamic';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTable } from '@refinedev/core';
import { ArrowUpDown, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Suspense } from 'react';

function UsersListContent() {
  const {
    result,
    pageSize,
    current,
    setCurrent,
    setPageSize,
    sorters,
    setSorters,
  } = useTable({
    resource: 'users',
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
  }) as any;

  const data = result?.data?.data ?? [];
  const total = result?.data?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize);
  const isLoading = result?.isLoading;

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
      case 'ACTIVE':
        return <Badge className="bg-green-500">正常</Badge>;
      case 'BANNED':
        return <Badge variant="destructive">封禁</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">未激活</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">用户管理</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">头像</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('createdAt')}
                      className="-ml-4"
                    >
                      注册时间
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>最后登录</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      暂无用户
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>
                            {item.username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.username}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {item.email || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm', {
                          locale: zhCN,
                        })}
                      </TableCell>
                      <TableCell>
                        {item.lastLoginAt ? (
                          format(
                            new Date(item.lastLoginAt),
                            'yyyy-MM-dd HH:mm',
                            {
                              locale: zhCN,
                            }
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            从未登录
                          </span>
                        )}
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

export default function UsersList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersListContent />
    </Suspense>
  );
}
