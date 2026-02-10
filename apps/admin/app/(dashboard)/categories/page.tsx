'use client';

import React, { useEffect, useState } from 'react';
import { List, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Tag, Button, Card, Row, Col, Statistic, message } from 'antd';
import { PlusOutlined, FolderOutlined, FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function CategoryListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  // 加载分类数据
  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        // 构建树形结构
        const tree = buildTree(data.data);
        setCategories(tree);
        // 默认展开所有一级分类
        const topLevelKeys = tree.map((cat: any) => cat.id);
        setExpandedRowKeys(topLevelKeys);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
      message.error('加载分类失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 构建树形结构
  const buildTree = (flatList: any[]) => {
    const map = new Map();
    const tree: any[] = [];

    // 先将所有节点放入 map
    flatList.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    // 构建树形关系
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

  // 处理删除
  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        message.success(`分类"${name}"已删除`);
        // 重新加载数据
        loadCategories();
      } else {
        message.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 计算统计数据
  const stats = {
    total: categories.reduce((sum, cat) => {
      const countChildren = (node: any): number => {
        let count = 1;
        if (node.children) {
          count += node.children.reduce((s: number, c: any) => s + countChildren(c), 0);
        }
        return count;
      };
      return sum + countChildren(cat);
    }, 0),
    active: categories.filter(cat => cat.status === 'ACTIVE').length,
    products: categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0),
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {record.icon && <span style={{ fontSize: '18px' }}>{record.icon}</span>}
          <span style={{ fontWeight: record.parentId ? 'normal' : 'bold' }}>
            {name}
          </span>
        </div>
      ),
    },
    {
      title: '链接标识',
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
      render: (slug: string) => (
        <code style={{
          background: '#f5f5f5',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          {slug}
        </code>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          ACTIVE: { color: 'green', text: '启用' },
          INACTIVE: { color: 'red', text: '禁用' },
        };
        const { color, text } = config[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '产品数',
      key: 'productCount',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <FileTextOutlined style={{ color: '#722ed1' }} />
          <span style={{ fontWeight: 'bold' }}>
            {record._count?.products || 0}
          </span>
        </Space>
      ),
    },
    {
      title: '子分类',
      key: 'childCount',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <FolderOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 'bold' }}>
            {record._count?.other_categories || 0}
          </span>
        </Space>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            confirmTitle={`确定删除分类"${record.name}"吗？`}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="categories-page">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="分类总数"
              value={stats.total}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#3f8fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="启用中"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="总产品数"
              value={stats.products}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 分类列表 */}
      <List
        headerButtons={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => router.push('/categories/create')}
          >
            添加分类
          </Button>
        }
      >
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
            defaultExpandAllRows: false,
          }}
          scroll={{ x: 1000 }}
        />
      </List>
    </div>
  );
}
