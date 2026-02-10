'use client';

import React, { useState } from 'react';
import { useTable, List } from '@refinedev/antd';
import { Table, Space, Tag, Button, Card, Row, Col, Statistic, Input, Select, Modal, message } from 'antd';
import { SearchOutlined, DollarOutlined, ShoppingCartOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Search } = Input;

export default function OrderListPage() {
  const router = useRouter();
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  const { tableProps, searchFormProps, filters } = useTable({
    resource: 'orders',
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: any = [];
      const { orderNo, buyerEmail, status, paymentStatus } = params;

      if (orderNo) {
        filters.push({ field: 'orderNo', operator: 'contains', value: orderNo });
      }
      if (buyerEmail) {
        filters.push({ field: 'buyerEmail', operator: 'contains', value: buyerEmail });
      }
      if (status) {
        filters.push({ field: 'status', operator: 'eq', value: status });
      }
      if (paymentStatus) {
        filters.push({ field: 'paymentStatus', operator: 'eq', value: paymentStatus });
      }

      return filters;
    },
  });

  // 处理退款
  const handleRefund = async () => {
    if (!refundReason.trim()) {
      message.error('请输入退款原因');
      return;
    }

    setRefunding(true);
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundAmount: selectedOrder.paidAmount,
          refundReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message.success('退款成功');
        setRefundModalVisible(false);
        setRefundReason('');
        // 刷新表格
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

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (text: string) => (
        <code style={{
          fontSize: '12px',
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
      title: '买家邮箱',
      dataIndex: 'buyerEmail',
      key: 'buyerEmail',
      width: 180,
      render: (email: string) => email || '-',
    },
    {
      title: '金额',
      key: 'amount',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f5222d' }}>
            ¥{parseFloat(record.totalAmount.toString()).toFixed(2)}
          </div>
          {record.discountAmount > 0 && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              优惠: ¥{parseFloat(record.discountAmount.toString()).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          PENDING: { color: 'default', text: '待处理' },
          PAID: { color: 'processing', text: '已支付' },
          DELIVERED: { color: 'success', text: '已发货' },
          COMPLETED: { color: 'success', text: '已完成' },
          CANCELLED: { color: 'default', text: '已取消' },
          REFUNDED: { color: 'warning', text: '已退款' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          UNPAID: { color: 'default', text: '未支付' },
          PAID: { color: 'success', text: '已支付' },
          REFUNDED: { color: 'warning', text: '已退款' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '商品数量',
      key: 'itemCount',
      width: 100,
      render: (_: any, record: any) => (
        <span>{record._count?.order_items || 0} 件</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/orders/show/${record.id}`)}
          >
            查看
          </Button>
          {record.status !== 'REFUNDED' && record.paymentStatus === 'PAID' && (
            <Button
              size="small"
              danger
              onClick={() => {
                setSelectedOrder(record);
                setRefundModalVisible(true);
              }}
            >
              退款
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-page">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic
              title="订单总数"
              value={tableProps?.dataSource?.length || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#3f8fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic
              title="已完成"
              value={tableProps?.dataSource?.filter((o: any) => o.status === 'COMPLETED').length || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic
              title="总收入"
              value={tableProps?.dataSource?.reduce((sum: number, o: any) => sum + parseFloat(o.paidAmount || 0), 0).toFixed(2) || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined">
            <Statistic
              title="已退款"
              value={tableProps?.dataSource?.filter((o: any) => o.status === 'REFUNDED').length || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space wrap>
            <Search
              placeholder="搜索订单号"
              style={{ width: 200 }}
              onSearch={(value) => {
                // 搜索逻辑
              }}
            />
            <Search
              placeholder="搜索买家邮箱"
              style={{ width: 200 }}
              onSearch={(value) => {
                // 搜索逻辑
              }}
            />
            <Select
              placeholder="订单状态"
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value="PENDING">待处理</Select.Option>
              <Select.Option value="PAID">已支付</Select.Option>
              <Select.Option value="DELIVERED">已发货</Select.Option>
              <Select.Option value="COMPLETED">已完成</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
              <Select.Option value="REFUNDED">已退款</Select.Option>
            </Select>
            <Select
              placeholder="支付状态"
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value="UNPAID">未支付</Select.Option>
              <Select.Option value="PAID">已支付</Select.Option>
              <Select.Option value="REFUNDED">已退款</Select.Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 订单列表 */}
      <List>
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            ...tableProps?.pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个订单`,
          }}
        />
      </List>

      {/* 退款模态框 */}
      <Modal
        title={`订单退款 - ${selectedOrder?.orderNo}`}
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
            <strong>订单金额:</strong> ¥{selectedOrder?.paidAmount ? parseFloat(selectedOrder.paidAmount.toString()).toFixed(2) : '0.00'}
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>退款金额:</strong> ¥{selectedOrder?.paidAmount ? parseFloat(selectedOrder.paidAmount.toString()).toFixed(2) : '0.00'}
          </p>
          <Input.TextArea
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
