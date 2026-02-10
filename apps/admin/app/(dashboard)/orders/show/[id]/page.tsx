'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Table, Divider, Row, Col, Statistic, Button, message, Modal, Input } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';

const { TextArea } = Input;

export default function OrderShowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  // 加载订单详情
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          message.error('加载订单详情失败');
        }
      } catch (error) {
        message.error('加载订单详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  // 处理退款
  const handleRefund = async () => {
    if (!refundReason.trim()) {
      message.error('请输入退款原因');
      return;
    }

    setRefunding(true);
    try {
      const response = await fetch(`/api/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundAmount: order.paidAmount,
          refundReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message.success('退款成功');
        setRefundModalVisible(false);
        setRefundReason('');
        // 重新加载订单
        window.location.reload();
      } else {
        message.error(data.error || '退款失败');
      }
    } catch (error) {
      message.error('退款失败');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return <Card loading={loading}>加载中...</Card>;
  }

  if (!order) {
    return <Card>订单不存在</Card>;
  }

  const statusMap: Record<string, { color: string; text: string }> = {
    PENDING: { color: 'default', text: '待处理' },
    PAID: { color: 'processing', text: '已支付' },
    DELIVERED: { color: 'success', text: '已发货' },
    COMPLETED: { color: 'success', text: '已完成' },
    CANCELLED: { color: 'default', text: '已取消' },
    REFUNDED: { color: 'warning', text: '已退款' },
  };

  const paymentStatusMap: Record<string, { color: string; text: string }> = {
    UNPAID: { color: 'default', text: '未支付' },
    PAID: { color: 'success', text: '已支付' },
    REFUNDED: { color: 'warning', text: '已退款' },
  };

  const inventoryColumns = [
    {
      title: '卡密',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      render: (text: string) => (
        <code style={{
          fontSize: '14px',
          fontFamily: 'monospace',
          background: '#f5f5f5',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          {text}
        </code>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          AVAILABLE: { color: 'green', text: '可用' },
          RESERVED: { color: 'orange', text: '预留' },
          SOLD: { color: 'red', text: '已售' },
          EXPIRED: { color: 'default', text: '过期' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '售出时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  const orderItemColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record.productImage && (
            <img
              src={record.productImage}
              alt={name}
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `¥${parseFloat(price.toString()).toFixed(2)}`,
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      render: (subtotal: number) => (
        <strong style={{ color: '#f5222d' }}>
          ¥{parseFloat(subtotal.toString()).toFixed(2)}
        </strong>
      ),
    },
  ];

  return (
    <div className="order-detail-page">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="订单金额"
              value={parseFloat(order.totalAmount.toString()).toFixed(2)}
              prefix="¥"
              valueStyle={{ color: '#3f8fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="实付金额"
              value={parseFloat(order.paidAmount.toString()).toFixed(2)}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="商品数量"
              value={order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
              suffix="件"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 订单信息 */}
      <Card
        title="订单信息"
        style={{ marginBottom: '24px' }}
        extra={
          order.status !== 'REFUNDED' && order.paymentStatus === 'PAID' && (
            <Button danger onClick={() => setRefundModalVisible(true)}>
              退款
            </Button>
          )
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="订单号">
            <code style={{ fontSize: '14px', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
              {order.orderNo}
            </code>
          </Descriptions.Item>

          <Descriptions.Item label="买家邮箱">
            {order.buyerEmail || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="订单状态">
            <Tag color={statusMap[order.status]?.color}>
              {statusMap[order.status]?.text}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="支付状态">
            <Tag color={paymentStatusMap[order.paymentStatus]?.color}>
              {paymentStatusMap[order.paymentStatus]?.text}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="支付方式">
            {order.paymentMethod || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="交易号">
            {order.transactionId || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {new Date(order.createdAt).toLocaleString('zh-CN')}
          </Descriptions.Item>

          <Descriptions.Item label="支付时间">
            {order.paidAt ? new Date(order.paidAt).toLocaleString('zh-CN') : '-'}
          </Descriptions.Item>

          {order.deliveredAt && (
            <Descriptions.Item label="发货时间">
              {new Date(order.deliveredAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          )}

          {order.refundAt && (
            <Descriptions.Item label="退款时间">
              {new Date(order.refundAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          )}

          {order.refundAmount && (
            <Descriptions.Item label="退款金额">
              ¥{parseFloat(order.refundAmount.toString()).toFixed(2)}
            </Descriptions.Item>
          )}

          {order.refundReason && (
            <Descriptions.Item label="退款原因" span={2}>
              {order.refundReason}
            </Descriptions.Item>
          )}

          {order.discountAmount > 0 && (
            <Descriptions.Item label="优惠金额">
              ¥{parseFloat(order.discountAmount.toString()).toFixed(2)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 商品明细 */}
      <Card title="商品明细" style={{ marginBottom: '24px' }}>
        <Table
          dataSource={order.order_items || []}
          columns={orderItemColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* 发货的卡密 */}
      {order.inventory && order.inventory.length > 0 && (
        <Card
          title={`已发卡密 (${order.inventory.length}个)`}
          extra={
            <Button
              type="primary"
              size="small"
              onClick={() => {
                const cards = order.inventory.map((inv: any) => inv.cardNumber).join('\n');
                navigator.clipboard.writeText(cards);
                message.success('卡密已复制到剪贴板');
              }}
            >
              一键复制全部
            </Button>
          }
        >
          <TextArea
            rows={Math.min(order.inventory.length, 15)}
            value={order.inventory.map((inv: any) => inv.cardNumber).join('\n')}
            readOnly
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              background: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
            }}
          />
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#0050b3',
          }}>
            <strong>提示：</strong>卡密每行一条，可直接选中复制或点击上方"一键复制全部"按钮。
          </div>
        </Card>
      )}

      {/* 退款模态框 */}
      <Modal
        title={`订单退款 - ${order.orderNo}`}
        open={refundModalVisible}
        onCancel={() => {
          setRefundModalVisible(false);
          setRefundReason('');
        }}
        onOk={handleRefund}
        confirmLoading={refunding}
      >
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>订单金额:</strong> ¥{parseFloat(order.paidAmount.toString()).toFixed(2)}
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>退款金额:</strong> ¥{parseFloat(order.paidAmount.toString()).toFixed(2)}
          </p>
          <TextArea
            rows={4}
            placeholder="请输入退款原因..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
