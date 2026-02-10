'use client';

import React from 'react';
import { useOne } from '@refinedev/core';
import { Show } from '@refinedev/antd';
import { Typography, Descriptions, Tag, Image, Divider, Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';

const { Title } = Typography;

export default function ProductShowPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useOne({
    resource: 'products',
    id,
  });

  const record = data?.data;

  const statusMap: Record<string, { color: string; text: string }> = {
    DRAFT: { color: 'default', text: '草稿' },
    ACTIVE: { color: 'success', text: '上架' },
    INACTIVE: { color: 'warning', text: '下架' },
    SOLD_OUT: { color: 'error', text: '售罄' },
  };

  const stockTypeMap: Record<string, string> = {
    CARD: '🎴 卡密',
    ACCOUNT: '👤 账号',
    COUPON: '🎟️ 优惠券',
    OTHER: '📦 其他',
  };

  return (
    <Show isLoading={isLoading}>
      {record && (
        <div className="product-detail">
          <Row gutter={[24, 24]}>
            {/* 左侧：产品图片和基本信息 */}
            <Col xs={24} md={10}>
              <Card>
                <Image
                  src={record.image || '/placeholder.png'}
                  alt={record.name}
                  style={{ width: '100%', borderRadius: '8px' }}
                  fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='80' fill='%23999'%3E📦%3C/text%3E%3C/svg%3E"
                />
                <Divider />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="销量"
                      value={record.salesCount || 0}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="浏览量"
                      value={record.viewCount || 0}
                      prefix={<EyeOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 右侧：详细信息 */}
            <Col xs={24} md={14}>
              <Card>
                <Title level={3}>{record.name}</Title>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="URL Slug">
                    <code>{record.slug}</code>
                  </Descriptions.Item>

                  <Descriptions.Item label="分类">
                    <Tag color="purple">
                      {record.categories?.icon} {record.categories?.name || '-'}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="售价">
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                        ¥{parseFloat(record.price.toString()).toFixed(2)}
                      </span>
                      {record.originalPrice && (
                        <span style={{ marginLeft: '12px', textDecoration: 'line-through', color: '#999' }}>
                          ¥{parseFloat(record.originalPrice.toString()).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label="状态">
                    <Tag color={statusMap[record.status]?.color}>
                      {statusMap[record.status]?.text}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="库存类型">
                    {stockTypeMap[record.stockType]}
                  </Descriptions.Item>

                  <Descriptions.Item label="推荐产品">
                    {record.featured ? (
                      <Tag color="gold">⭐ 推荐</Tag>
                    ) : (
                      <Tag>普通</Tag>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="自动发货">
                    {record.autoDeliver ? (
                      <Tag color="green">✓ 开启</Tag>
                    ) : (
                      <Tag color="red">✗ 关闭</Tag>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="排序">
                    {record.sort}
                  </Descriptions.Item>

                  <Descriptions.Item label="创建时间">
                    {new Date(record.createdAt).toLocaleString('zh-CN')}
                  </Descriptions.Item>

                  <Descriptions.Item label="更新时间">
                    {new Date(record.updatedAt).toLocaleString('zh-CN')}
                  </Descriptions.Item>
                </Descriptions>

                {record.description && (
                  <>
                    <Divider orientation="left">产品描述</Divider>
                    <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                      {record.description}
                    </div>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Show>
  );
}
