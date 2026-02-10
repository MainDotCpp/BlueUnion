'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

export default function DashboardPage() {
  // 模拟数据，后续会从 API 获取
  const stats = [
    {
      title: '今日订单',
      value: 128,
      prefix: <FileTextOutlined />,
      trend: 12.5,
      color: '#1890ff',
    },
    {
      title: '今日收入',
      value: 25680,
      prefix: <DollarOutlined />,
      precision: 2,
      trend: 8.3,
      color: '#52c41a',
    },
    {
      title: '产品总数',
      value: 456,
      prefix: <ShoppingOutlined />,
      trend: -2.1,
      color: '#722ed1',
    },
    {
      title: '用户总数',
      value: 1234,
      prefix: <UserOutlined />,
      trend: 15.6,
      color: '#fa8c16',
    },
  ];

  const recentOrders = [
    {
      key: '1',
      orderNo: 'ORD20240210001',
      product: 'Steam 充值卡 100元',
      amount: 98.00,
      status: 'paid',
      time: '2024-02-10 14:30:25',
    },
    {
      key: '2',
      orderNo: 'ORD20240210002',
      product: 'Netflix 月度会员',
      amount: 45.00,
      status: 'delivered',
      time: '2024-02-10 14:28:15',
    },
    {
      key: '3',
      orderNo: 'ORD20240210003',
      product: 'ChatGPT Plus 账号',
      amount: 120.00,
      status: 'pending',
      time: '2024-02-10 14:25:10',
    },
  ];

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: '待支付' },
          paid: { color: 'blue', text: '已支付' },
          delivered: { color: 'green', text: '已发货' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        📊 数据概览
      </h1>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision || 0}
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
                suffix={
                  stat.trend > 0 ? (
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> {stat.trend}%
                    </span>
                  ) : (
                    <span style={{ fontSize: '14px', color: '#f5222d' }}>
                      <ArrowDownOutlined /> {Math.abs(stat.trend)}%
                    </span>
                  )
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近订单 */}
      <Card title="📦 最近订单" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={recentOrders}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="🚀 快速操作" size="small">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/products/create">➕ 添加新产品</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/inventory/create">📦 导入库存</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/orders">📋 查看所有订单</a>
              </li>
              <li>
                <a href="/settings">⚙️ 系统设置</a>
              </li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="📢 系统通知" size="small">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px', color: '#52c41a' }}>
                ✅ 系统运行正常
              </li>
              <li style={{ marginBottom: '8px', color: '#1890ff' }}>
                ℹ️ 今日新增 12 个订单
              </li>
              <li style={{ marginBottom: '8px', color: '#fa8c16' }}>
                ⚠️ 有 3 个产品库存不足
              </li>
              <li style={{ color: '#722ed1' }}>
                💡 建议：定期备份数据
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
