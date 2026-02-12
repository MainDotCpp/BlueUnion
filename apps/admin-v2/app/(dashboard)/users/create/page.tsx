'use client';

import { useForm } from '@refinedev/core';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function CreateUserContent() {
  const router = useRouter();
  const { onFinish, formLoading } = useForm({
    resource: 'users',
    action: 'create',
    redirect: 'list',
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      id: crypto.randomUUID(),
      roleId: data.roleId || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
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
        <h2 className="text-3xl font-bold tracking-tight">新建用户</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" name="email" type="email" autoComplete="off" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select name="status" defaultValue="ACTIVE">
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">正常</SelectItem>
                    <SelectItem value="INACTIVE">未激活</SelectItem>
                    <SelectItem value="BANNED">封禁</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role selection would typically fetch roles from DB. 
                  For now we'll put a placeholder or hardcode if we knew IDs.
                  Since we don't have roles fetched, we might need a useSelect.
                  For this MVP, we'll hide it or provide a simple input.
              */}
              <div className="space-y-2">
                <Label htmlFor="roleId">角色ID</Label>
                <Input
                  id="roleId"
                  name="roleId"
                  placeholder="请输入角色ID"
                  required
                />
              </div>
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
                    保存用户
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

export default function CreateUser() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateUserContent />
    </Suspense>
  );
}
