'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTable, useDelete, useMany } from '@refinedev/core';
import { GetListResponse } from '@refinedev/core';
import { products, categories, ProductStatus } from '@blueunion/database';
import {
  Edit,
  Trash2,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Filter,
  Package,
  Copy,
} from 'lucide-react';
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
import { Suspense, useState, useEffect } from 'react';

function ProductsListContent() {
  const {
    result,
    pageSize,
    current,
    setCurrent,
    sorters,
    setSorters,
    setFilters,
  } = useTable<products>({
    resource: 'products',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },
    syncWithLocation: true,
  }) as any;

  const data = result?.data ?? [];
  const total = result?.total ?? 0;
  const isLoading = result?.isLoading;

  const { mutate: deleteMutate } = useDelete();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const pageCount = Math.ceil((total || 0) / (pageSize || 10));

  // Fetch category names based on categoryId from products
  const categoryIds =
    data?.map((item: products) => item.categoryId).filter(Boolean) ?? [];
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useMany<categories>({
      resource: 'categories',
      ids: Array.from(new Set(categoryIds)),
      queryOptions: {
        enabled: categoryIds.length > 0,
      },
    }) as any;

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

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutate({
        resource: 'products',
        id: deleteId,
      });
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">
            上架中
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge variant="secondary" className="text-zinc-500 bg-zinc-100">
            草稿
          </Badge>
        );
      case 'INACTIVE':
        return <Badge variant="secondary">已下架</Badge>;
      case 'SOLD_OUT':
        return <Badge variant="destructive">已售罄</Badge>;
      default:
        return <Badge variant="outline">{status || '未知'}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* 顶部 Header 区域 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            产品管理
          </h2>
          <p className="text-muted-foreground mt-1">
            管理您的产品目录、库存和定价策略。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex">
            <Package className="mr-2 h-4 w-4" />
            导出数据
          </Button>
          <Button
            asChild
            className="bg-primary shadow-sm hover:shadow-md transition-all"
          >
            <Link href="/products/create">
              <Plus className="mr-2 h-4 w-4" />
              添加产品
            </Link>
          </Button>
        </div>
      </div>

      {/* 主要内容区域 Card */}
      <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b bg-zinc-50/40 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索产品名称、编号..."
                className="pl-9 bg-white"
                onChange={(e) => {
                  const value = e.target.value;
                  if (searchDebounceTimer) {
                    clearTimeout(searchDebounceTimer);
                  }
                  const timer = setTimeout(() => {
                    setFilters([
                      {
                        field: 'name',
                        operator: 'contains',
                        value: value,
                      },
                    ]);
                  }, 300);
                  setSearchDebounceTimer(timer);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-3.5 w-3.5" />
                筛选
              </Button>
              {/* 这里可以放置更多筛选控件 */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] pl-6">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort('name')}
                    className="-ml-4 hover:bg-transparent font-semibold text-zinc-700"
                  >
                    产品信息
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                </TableHead>
                <TableHead>分类</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort('price')}
                    className="-ml-4 hover:bg-transparent font-semibold text-zinc-700"
                  >
                    价格
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                </TableHead>
                <TableHead>状态</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort('createdAt')}
                    className="-ml-4 hover:bg-transparent font-semibold text-zinc-700"
                  >
                    创建时间
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                </TableHead>
                <TableHead className="text-right pr-6">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="h-16">
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      <div className="h-4 w-full bg-zinc-100 animate-pulse rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12 text-zinc-200" />
                      <p>暂无产品数据</p>
                      <Button variant="link" asChild className="px-0">
                        <Link href="/products/create">立即创建一个</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item: any) => {
                  const category = categoriesData?.data?.find(
                    (cat: any) => cat.id === item.categoryId
                  );

                  return (
                    <TableRow
                      key={item.id}
                      className="group hover:bg-zinc-50/50 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-zinc-900 group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-[10px]">
                              {item.id.slice(0, 8)}...
                            </span>
                            {item.description && (
                              <span className="max-w-[200px] truncate opacity-80">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isCategoriesLoading ? (
                          <div className="h-5 w-16 bg-zinc-100 animate-pulse rounded"></div>
                        ) : (
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                            {category?.name || '未分类'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium font-mono">
                        ¥{Number(item.price).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.createdAt
                          ? format(
                              new Date(item.createdAt),
                              'yyyy-MM-dd HH:mm',
                              {
                                locale: zhCN,
                              }
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
                            >
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(item.id);
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              复制 ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/edit/${item.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑产品
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => {
                                setDeleteId(item.id);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t bg-zinc-50/40 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {total > 0 ? (
                <>
                  显示第{' '}
                  <span className="font-medium">
                    {(current - 1) * pageSize + 1}
                  </span>{' '}
                  到{' '}
                  <span className="font-medium">
                    {Math.min(current * pageSize, total)}
                  </span>{' '}
                  条，共 <span className="font-medium">{total}</span> 条记录
                </>
              ) : (
                '无记录'
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent(current - 1)}
                disabled={current <= 1}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">上一页</span>
                {'<'}
              </Button>
              <div className="flex items-center gap-1 min-w-[3rem] justify-center text-sm font-medium">
                {current} / {pageCount || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent(current + 1)}
                disabled={current >= pageCount}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">下一页</span>
                {'>'}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除此产品?</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该产品及其相关数据。此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProductsList() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ProductsListContent />
    </Suspense>
  );
}
