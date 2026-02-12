'use client';

export const dynamic = 'force-dynamic';

import { useForm } from '@refinedev/core';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

import { Suspense } from 'react';

function CreateCategoryContent() {
  const router = useRouter();
  const { onFinish, formLoading } = useForm({
    resource: 'categories',
    action: 'create',
    redirect: 'list',
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Type conversion for sort (string to int)
    const payload = {
      ...data,
      sort: data.sort ? parseInt(data.sort as string, 10) : 0,
      id: crypto.randomUUID(),
    };

    onFinish(payload);
  };

  const isLoading = formLoading;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">新建分类</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                name="name"
                placeholder="例如：数码产品"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">标识 (Slug)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="例如：digital-products"
                required
              />
              <p className="text-sm text-muted-foreground">
                用于URL的唯一标识符，建议使用英文、数字和连字符。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select name="status" defaultValue="ACTIVE">
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">启用</SelectItem>
                    <SelectItem value="INACTIVE">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">排序权重</Label>
                <Input
                  id="sort"
                  name="sort"
                  type="number"
                  defaultValue="0"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="分类的简要描述..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>保存中...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存分类
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateCategory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCategoryContent />
    </Suspense>
  );
}
