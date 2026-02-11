'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Check,
  Box,
  CreditCard,
  Loader2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// --- 类型定义 ---
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  status: string;
  categories: Category | null;
}

// --- 主页面逻辑 ---
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 筛选与搜索
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 交互状态
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        if (pRes.ok) setProducts(await pRes.json());
        if (cRes.ok) setCategories(await cRes.json());
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const formatPrice = (p: any) => {
    const num =
      typeof p === 'string' ? parseFloat(p) : typeof p === 'number' ? p : 0;
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(num);
  };

  const getPrice = (p: any) => {
    return typeof p === 'string'
      ? parseFloat(p)
      : typeof p === 'number'
        ? p
        : 0;
  };

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === 'all' || p.categories?.id === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && p.status === 'ACTIVE';
  });

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* 背景图片层 */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497294815431-9365093b7331?q=80&w=2670&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-sm" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 pt-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 2. Sidebar - 侧边栏导航 */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-5">
              <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                商品分类
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    selectedCategory === 'all'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Box
                      className={cn(
                        'h-4 w-4 transition-colors',
                        selectedCategory === 'all'
                          ? 'text-indigo-500'
                          : 'text-slate-400 group-hover:text-slate-500'
                      )}
                    />
                    <span>全部商品</span>
                  </div>
                  {selectedCategory === 'all' && (
                    <ChevronRight className="h-4 w-4 text-indigo-400" />
                  )}
                </button>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500/80" />
                    <span className="text-xs mt-2 font-medium">
                      加载分类...
                    </span>
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                          : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full transition-colors',
                            selectedCategory === cat.id
                              ? 'bg-indigo-500'
                              : 'bg-slate-300 group-hover:bg-slate-400'
                          )}
                        />
                        <span>{cat.name}</span>
                      </div>
                      {selectedCategory === cat.id && (
                        <ChevronRight className="h-4 w-4 text-indigo-400" />
                      )}
                    </button>
                  ))
                )}
              </nav>
            </div>

            <div className="rounded-2xl border border-white/50 bg-gradient-to-br from-indigo-500/90 to-purple-600/90 p-5 text-white shadow-lg shadow-indigo-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm tracking-wide">
                  自动发货
                </span>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
                24小时全自动发货系统。支付成功后，卡密信息将立即发送至您的邮箱。
              </p>
            </div>
          </aside>

          {/* 3. Main Content - 列表视图 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm flex flex-col h-full min-h-[600px]">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100/60">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">商品列表</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    当前展示 {filtered.length} 个精选商品
                  </p>
                </div>

                {/* Desktop Search */}
                <div className="hidden sm:block w-72">
                  <div className="relative group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      placeholder="搜索商品..."
                      className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-indigo-200 focus:ring-indigo-100 transition-all rounded-xl h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100/60">
                        <TableHead className="w-[40%] pl-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                          商品名称
                        </TableHead>
                        <TableHead className="w-[15%] py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                          分类
                        </TableHead>
                        <TableHead className="w-[15%] py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                          价格
                        </TableHead>
                        <TableHead className="w-[15%] py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                          状态
                        </TableHead>
                        <TableHead className="w-[15%] pr-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Loader2 className="h-8 w-8 animate-spin text-indigo-500/80 mb-2" />
                              <span className="text-sm font-medium">
                                加载商品列表...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filtered.length > 0 ? (
                        filtered.map((product) => (
                          <TableRow
                            key={product.id}
                            className="hover:bg-indigo-50/30 transition-colors cursor-pointer border-slate-100/60 group"
                            onClick={() => {
                              setSelectedProduct(product);
                              setQuantity(1);
                            }}
                          >
                            <TableCell className="pl-6 py-4 align-middle font-medium">
                              <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors text-base">
                                {product.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 align-middle">
                              <Badge
                                variant="secondary"
                                className="bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-200"
                              >
                                {product.categories?.name || '未分类'}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 align-middle">
                              <span className="font-mono font-bold text-slate-900 text-base">
                                {formatPrice(product.price)}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 align-middle">
                              {product.status === 'ACTIVE' ? (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 pl-1.5 gap-1.5"
                                >
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                  </span>
                                  库存充足
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="pl-1.5 gap-1.5 bg-slate-100 text-slate-500"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                  缺货
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="pr-6 py-4 align-middle text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-9 px-4 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 font-medium transition-all shadow-sm"
                              >
                                购买
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-96 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-slate-300" />
                              </div>
                              <p className="text-base font-medium text-slate-900">
                                未找到商品
                              </p>
                              <p className="text-sm text-slate-400 mt-1 mb-4">
                                尝试更换关键词或查看其他分类
                              </p>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedCategory('all');
                                }}
                                className="rounded-full"
                              >
                                清除筛选
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {filtered.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-100/60 bg-slate-50/30 text-xs text-slate-400 flex justify-between items-center rounded-b-2xl">
                  <span>显示 {filtered.length} 个结果</span>
                  <span>End of list</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 4. Checkout Modal - Shadcn Dialog */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden gap-0">
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold text-slate-900">
              创建订单
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            {selectedProduct && (
              <>
                {/* Product Summary */}
                <div className="mb-6 rounded-xl bg-slate-50 border border-slate-100/80 p-4">
                  <div className="flex gap-4 items-center mb-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <Box className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1 truncate">
                        {selectedProduct.name}
                      </h4>
                      <div className="font-mono text-sm font-bold text-indigo-600">
                        {formatPrice(selectedProduct.price)}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          / 件
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedProduct.description || '暂无描述'}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  {/* Quantity */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        购买数量
                      </label>
                      <div className="flex items-center h-10">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-full w-10 rounded-r-none border-r-0"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <div className="h-full flex-1 border-y border-slate-200 flex items-center justify-center bg-white z-10 font-bold text-sm">
                          {quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-full w-10 rounded-l-none border-l-0"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        应付总额
                      </label>
                      <div className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-mono font-bold text-indigo-600">
                        {formatPrice(
                          getPrice(selectedProduct.price) * quantity
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      联系方式 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="接收卡密的邮箱或手机号"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="h-10 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      查询密码 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="设置订单查询密码 (6-20位)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex gap-3">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl font-bold text-slate-600 hover:text-slate-900"
              onClick={() => setSelectedProduct(null)}
            >
              取消
            </Button>
            <Button
              className="w-full h-11 rounded-xl font-bold shadow-lg shadow-indigo-500/20"
              disabled={!contact || !password}
            >
              立即支付
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
