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
import { useTable, useDelete } from '@refinedev/core';
import { Edit, Trash2, Plus, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { Suspense } from 'react';

function CategoriesListContent() {
  const {
    result,
    pageSize,
    current,
    setCurrent,
    setPageSize,
    sorters,
    setSorters,
  } = useTable({
    resource: 'categories',
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

  const { mutate: deleteMutate } = useDelete();

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

  const handleDelete = (id: string) => {
    deleteMutate({
      resource: 'categories',
      id,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">启用</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">停用</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">分类管理</h2>
        <Button asChild>
          <Link href="/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            新建分类
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>分类列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('name')}
                      className="-ml-4"
                    >
                      名称
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>标识 (Slug)</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
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
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.slug}</TableCell>
                      <TableCell>{item.sort}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm', {
                          locale: zhCN,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button - Placeholder for now */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            title="编辑功能开发中"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  此操作将永久删除分类 "{item.name}
                                  "。此操作无法撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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

export default function CategoriesList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesListContent />
    </Suspense>
  );
}
