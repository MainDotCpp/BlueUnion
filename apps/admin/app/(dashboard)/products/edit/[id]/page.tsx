'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Edit } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch } from 'antd';

const { TextArea } = Input;

export default function ProductEditPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: 'products',
    action: 'edit',
    redirect: 'list',
  });

  // 加载分类列表
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories?status=ACTIVE');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={queryResult?.isLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="产品名称"
          name="name"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="例如: Steam 充值卡 100元" />
        </Form.Item>

        <Form.Item
          label="链接标识"
          name="slug"
          rules={[
            { required: true, message: '请输入链接标识' },
            { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和短横线' },
          ]}
          help="用于网址的唯一标识，只能包含小写字母、数字和短横线"
        >
          <Input placeholder="例如: steam-card-100" />
        </Form.Item>

        <Form.Item label="产品描述" name="description">
          <TextArea rows={4} placeholder="产品详细描述..." />
        </Form.Item>

        <Form.Item label="产品图片" name="image">
          <Input placeholder="图片网址" />
        </Form.Item>

        <Form.Item
          label="售价"
          name="price"
          rules={[{ required: true, message: '请输入售价' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            prefix="¥"
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item label="原价" name="originalPrice">
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            prefix="¥"
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          label="分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类" loading={loadingCategories}>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select>
            <Select.Option value="DRAFT">草稿</Select.Option>
            <Select.Option value="ACTIVE">上架</Select.Option>
            <Select.Option value="INACTIVE">下架</Select.Option>
            <Select.Option value="SOLD_OUT">售罄</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="库存类型" name="stockType">
          <Select>
            <Select.Option value="CARD">卡密</Select.Option>
            <Select.Option value="ACCOUNT">账号</Select.Option>
            <Select.Option value="COUPON">优惠券</Select.Option>
            <Select.Option value="OTHER">其他</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="推荐产品" name="featured" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>

        <Form.Item label="自动发货" name="autoDeliver" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>

        <Form.Item label="排序" name="sort" help="数字越大越靠前">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Edit>
  );
}
