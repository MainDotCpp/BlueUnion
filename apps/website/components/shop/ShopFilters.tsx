import React from 'react';
import { Category } from '@/types/shop';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Box, CreditCard, ChevronRight } from 'lucide-react';

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ShopFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: ShopFiltersProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Search - Mobile only (desktop is in header usually, but good to have here too if needed) */}
      <div className="block lg:hidden relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="搜索商品..."
          className="pl-9 bg-white/60 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Categories
        </h3>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
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
              onClick={() => onSelectCategory(cat.id)}
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
  );
}
