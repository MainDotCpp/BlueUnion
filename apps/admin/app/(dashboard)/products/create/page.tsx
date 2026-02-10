'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Create } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, Switch, Upload, Button, Tooltip } from 'antd';
import { UploadOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { generateSlug } from '@/lib/slugify';

const { TextArea } = Input;

export default function ProductCreatePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const { formProps, saveButtonProps, form } = useForm({
    resource: 'products',
    action: 'create',
    redirect: 'list',
  });

  // 使用 Form.useWatch 监听 name 字段变化
  const nameValue = Form.useWatch('name', form);

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

  // 自动生成 slug
  useEffect(() => {
    if (nameValue && !manualSlugEdit && form) {
      const slug = generateSlug(nameValue);
      form.setFieldValue('slug', slug);
    }
  }, [nameValue, manualSlugEdit, form]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="产品名称"
          name="name"
          rules={[{ required: true, message: '请输入产品名称' }]}
        >
          <Input placeholder="例如: Steam 充值卡 100元" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              链接标识
              <Tooltip title="自动从产品名称生成，也可手动编辑">
                <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
              </Tooltip>
            </span>
          }
          name="slug"
          rules={[
            { required: true, message: '请输入链接标识' },
            { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和短横线' },
          ]}
          help="用于网址的唯一标识，只能包含小写字母、数字和短横线"
        >
          <Input
            placeholder="自动生成中..."
            onChange={() => setManualSlugEdit(true)}
            addonAfter={
              <Button
                type="link"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => {
                  setManualSlugEdit(false);
                  const name = form?.getFieldValue('name');
                  if (name) {
                    form?.setFieldValue('slug', generateSlug(name));
                  }
                }}
              >
                重新生成
              </Button>
            }
          />
        </Form.Item>

        <Form.Item label="产品描述" name="description">
          <TextArea
            rows={4}
            placeholder="产品详细描述..."
          />
        </Form.Item>

        <Form.Item label="产品图片" name="image">
          <Input placeholder="图片 URL 或稍后上传" />
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

        <Form.Item
          label="状态"
          name="status"
          initialValue="DRAFT"
        >
          <Select>
            <Select.Option value="DRAFT">草稿</Select.Option>
            <Select.Option value="ACTIVE">上架</Select.Option>
            <Select.Option value="INACTIVE">下架</Select.Option>
            <Select.Option value="SOLD_OUT">售罄</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="推荐产品"
          name="featured"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>

        <Form.Item
          label="自动发货"
          name="autoDeliver"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>

        <Form.Item
          label="排序"
          name="sort"
          initialValue={0}
          help="数字越大越靠前"
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Create>
  );
}
