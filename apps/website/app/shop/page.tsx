'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Check,
  Box,
  CreditCard,
  Loader2,
  AlertCircle,
  ArrowRight,
  Filter,
  ShoppingBag,
  Terminal,
  ChevronRight,
} from 'lucide-react';

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

// --- Micro Design System (原子组件) ---
const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'indigo';
  loading?: boolean;
}) => {
  const variants = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-sm active:scale-[0.98]',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 border-transparent',
    outline:
      'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
    indigo:
      'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-md shadow-indigo-500/20 active:scale-[0.98]',
  };
  return (
    <button
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);

const Badge = ({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: 'slate' | 'green' | 'blue' | 'indigo';
}) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const Card = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`rounded-xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

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

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === 'all' || p.categories?.id === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && p.status === 'ACTIVE';
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      {/* --- 高级渐变背景 (Ambient Background) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 左上角 - 靛蓝光斑 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-[120px]" />
        {/* 右上角 - 紫罗兰光斑 */}
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-200/20 blur-[100px]" />
        {/* 右下角 - 青色光斑 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-100/30 blur-[120px]" />
      </div>

      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-slate-900 mr-8 tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20">
              <Terminal size={16} strokeWidth={3} />
            </div>
            <span className="text-lg">BlueUnion</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-100/50 rounded-full border border-slate-200/50">
            <a
              href="#"
              className="px-4 py-1.5 text-sm font-semibold text-slate-900 bg-white rounded-full shadow-sm"
            >
              商店
            </a>
            <a
              href="#"
              className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              订单
            </a>
            <a
              href="#"
              className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              文档
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="relative hidden sm:block w-64 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="搜索商品..."
                className="pl-9 h-10 bg-slate-50/50 border-slate-200 group-hover:bg-white focus:bg-white transition-all rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full p-0 border-slate-200"
            >
              <ShoppingBag className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* 2. Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">
            Digital Marketplace
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            探索精心策划的出海工具集合。所有商品均支持
            <span className="font-semibold text-indigo-600 mx-1">
              24/7 自动交付
            </span>
            与售后保障。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 3. Sidebar (Glass Effect) */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Categories
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Box
                      className={`h-4 w-4 ${selectedCategory === 'all' ? 'text-indigo-500' : 'text-slate-400'}`}
                    />
                    <span>全部商品</span>
                  </div>
                  {selectedCategory === 'all' && (
                    <ChevronRight className="h-4 w-4 text-indigo-400" />
                  )}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${selectedCategory === cat.id ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}
                      />
                      <span>{cat.name}</span>
                    </div>
                    {selectedCategory === cat.id && (
                      <ChevronRight className="h-4 w-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm">自动发货</span>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
                系统全天候自动监控。支付成功后，卡密信息将立即发送至您的邮箱。
              </p>
            </div>
          </aside>

          {/* 4. Main Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-[220px] rounded-xl border border-white/60 bg-white/40 p-6 shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <Card
                    key={product.id}
                    className="group flex flex-col justify-between hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer bg-white/70"
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuantity(1);
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge
                          color={
                            product.status === 'ACTIVE' ? 'green' : 'slate'
                          }
                        >
                          {product.status === 'ACTIVE'
                            ? 'Stock Available'
                            : 'Out of Stock'}
                        </Badge>
                        <span className="font-mono text-lg font-bold text-slate-900 tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                        {product.description || '暂无详细描述。'}
                      </p>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100/50 bg-slate-50/50 rounded-b-xl flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Instant Delivery
                      </span>
                      <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all shadow-sm">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/30 backdrop-blur-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 mb-4">
                  <Search className="h-6 w-6 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  未找到商品
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                  尝试搜索其他关键词，或查看所有分类。
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  清除筛选条件
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 5. Modern Drawer/Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">确认订单</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  请填写接收信息
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-full p-2 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-8">
              {/* Product Info Card */}
              <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200 text-indigo-600">
                  <Box className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {selectedProduct.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-slate-900">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      数量
                    </label>
                    <div className="flex h-10">
                      <button
                        type="button"
                        className="flex w-10 items-center justify-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-full min-w-0 border-y border-slate-200 text-center text-sm font-bold focus:outline-none focus:ring-0 z-10 bg-white"
                      />
                      <button
                        type="button"
                        className="flex w-10 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      总金额
                    </label>
                    <div className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-mono font-bold text-indigo-600">
                      {formatPrice(getPrice(selectedProduct.price) * quantity)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    联系方式 (邮箱/手机)
                  </label>
                  <Input
                    placeholder="用于接收卡密..."
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    查询密码
                  </label>
                  <Input
                    type="password"
                    placeholder="设置订单查询密码..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold text-slate-600"
                  onClick={() => setSelectedProduct(null)}
                >
                  取消
                </Button>
                <Button
                  variant="indigo"
                  className="w-full gap-2 h-11 rounded-xl font-bold shadow-lg shadow-indigo-500/30"
                  disabled={!contact || !password}
                >
                  立即支付
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
