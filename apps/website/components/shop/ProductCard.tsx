import React from 'react';
import { Product } from '@/types/shop';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="group relative flex flex-col justify-between overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}
            className={
              product.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : ''
            }
          >
            {product.status === 'ACTIVE' ? 'Stock Available' : 'Out of Stock'}
          </Badge>
          <span className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
          {product.description || '暂无详细描述。'}
        </p>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Instant Delivery
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:bg-white shadow-sm"
        >
          <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
}
