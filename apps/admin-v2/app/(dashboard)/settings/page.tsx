'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@refinedev/core';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  // Using 'system_config' resource.
  // Since system_config is a key-value store, we might need a custom action or
  // treat a specific ID as the "main config" or list them.
  // For MVP, let's assume we are editing a "site_settings" config record or similar.
  // OR, we can list all configs.
  // Given the "Settings" menu item usually implies "General Settings", let's build a form
  // that might update a specific record, OR just show a placeholder if we don't have a specific convention yet.

  // Let's do a "Site Configuration" form that maps to a specific key like 'site_config'

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight">系统设置</h2>

      <Card>
        <CardHeader>
          <CardTitle>基本设置</CardTitle>
          <CardDescription>配置网站的基本信息和参数</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">网站名称</Label>
              <Input id="siteName" defaultValue="蓝聚出海" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">客服邮箱</Label>
              <Input id="supportEmail" defaultValue="support@blueunion.com" />
            </div>

            <Button type="button" disabled title="演示功能">
              <Save className="mr-2 h-4 w-4" />
              保存设置 (演示)
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>安全设置</CardTitle>
          <CardDescription>修改管理员密码和安全策略</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            安全设置功能正在开发中...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
