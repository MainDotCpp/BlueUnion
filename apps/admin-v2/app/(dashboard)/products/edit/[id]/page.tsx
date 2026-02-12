'use client';

export const dynamic = 'force-dynamic';

import { useForm } from '@refinedev/react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function EditProductPageContent() {
  const router = useRouter();

  const {
    saveButtonProps,
    register,
    handleSubmit,
    formState: { errors },
    refineCore: { queryResult },
  } = useForm({
    refineCoreProps: {
      resource: 'products',
      action: 'edit',
      redirect: 'list',
      onMutationSuccess: () => {
        router.push('/products');
      },
    },
  }) as any;

  const isLoading = queryResult?.isLoading;
  const isSubmitting = saveButtonProps?.disabled;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">编辑产品</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>产品信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data: any) => {
              const payload = {
                ...data,
                price: Number(data.price),
              };
              return saveButtonProps.onClick(payload);
            })}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">产品名称</Label>
              <Input
                id="name"
                {...register('name', { required: '请输入产品名称' })}
                placeholder="请输入产品名称"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {String(errors.name.message)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">价格 (¥)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required: '请输入价格',
                    min: 0,
                  })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {String(errors.price.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="请输入分类"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <textarea
                id="description"
                {...register('description')}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="请输入产品描述"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">上架</option>
                <option value="draft">下架</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存更改'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductPageContent />
    </Suspense>
  );
}
