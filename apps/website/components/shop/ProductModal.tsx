import React, { useState, useEffect } from 'react';
import { Product } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Box, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Wait for animation
  };

  const calculateTotal = () => {
    const price =
      typeof product.price === 'string'
        ? parseFloat(product.price)
        : product.price;
    return price * quantity;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-200 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">确认订单</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              请填写接收信息
            </p>
          </div>
          <button
            onClick={handleClose}
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
                {product.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {product.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-slate-900">
                {formatPrice(product.price)}
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
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full min-w-0 border-y border-slate-200 text-center text-sm font-bold focus:outline-none focus:ring-0 z-10 bg-white text-slate-900"
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
                  {formatPrice(calculateTotal())}
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
              onClick={handleClose}
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
  );
}
