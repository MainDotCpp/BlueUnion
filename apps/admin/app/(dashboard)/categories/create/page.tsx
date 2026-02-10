'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Create } from '@refinedev/antd';
import { Form, Input, InputNumber, Select, TreeSelect, Button, Tooltip } from 'antd';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { generateSlug } from '@/lib/slugify';

const { TextArea } = Input;

export default function CategoryCreatePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const { formProps, saveButtonProps, form } = useForm({
    resource: 'categories',
    action: 'create',
    redirect: 'list',
  });

  // 使用 Form.useWatch 监听 name 字段变化
  const nameValue = Form.useWatch('name', form);

  // 加载分类列表（用于选择父分类）
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          // 构建树形选择数据
          const treeData = buildTreeSelectData(data.data);
          setCategories(treeData);
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

  // 构建 TreeSelect 数据结构
  const buildTreeSelectData = (flatList: any[]) => {
    const map = new Map();
    const tree: any[] = [];

    flatList.forEach(item => {
      map.set(item.id, {
        value: item.id,
        title: `${item.icon || ''} ${item.name}`,
        children: [],
      });
    });

    flatList.forEach(item => {
      const node = map.get(item.id);
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId).children.push(node);
      } else {
        tree.push(node);
      }
    });

    // 清理空 children
    const cleanTree = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          cleanTree(node.children);
        }
      });
    };
    cleanTree(tree);

    return tree;
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="分类名称"
          name="name"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="例如: 游戏充值" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              链接标识
              <Tooltip title="自动从分类名称生成，也可手动编辑">
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

        <Form.Item label="图标" name="icon" help="使用 emoji 作为分类图标">
          <Input placeholder="例如: 🎮" maxLength={2} />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea rows={3} placeholder="分类描述..." />
        </Form.Item>

        <Form.Item
          label="父分类"
          name="parentId"
          help="不选择则为一级分类"
        >
          <TreeSelect
            placeholder="请选择父分类（可选）"
            treeData={categories}
            loading={loadingCategories}
            allowClear
            showSearch
            treeDefaultExpandAll
            filterTreeNode={(input, treeNode) =>
              (treeNode.title as string).toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          initialValue="ACTIVE"
        >
          <Select>
            <Select.Option value="ACTIVE">启用</Select.Option>
            <Select.Option value="INACTIVE">禁用</Select.Option>
          </Select>
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
