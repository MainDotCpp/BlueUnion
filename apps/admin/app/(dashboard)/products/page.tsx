'use client';

import React, { useState, useEffect } from 'react';
import { useTable, List, EditButton, ShowButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Tag, Image, Button, Card, Statistic, Row, Col, Modal, Upload, Input, InputNumber, message, Badge, Tooltip } from 'antd';
import { PlusOutlined, RiseOutlined, EyeOutlined, ShoppingOutlined, InboxOutlined, DatabaseOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { UploadProps } from 'antd';
import './products.css';

const { TextArea } = Input;
const { Dragger } = Upload;

export default function ProductListPage() {
  const router = useRouter();
  const { tableProps } = useTable({
    resource: 'products',
    syncWithLocation: true,
  });

  const [inventoryStats, setInventoryStats] = useState<Record<string, any>>({});
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [extractModalVisible, setExtractModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractQuantity, setExtractQuantity] = useState(1);
  const [extractEmail, setExtractEmail] = useState('');
  const [extractNote, setExtractNote] = useState('');
  const [extractedCards, setExtractedCards] = useState<any[]>([]);

  // 加载所有产品的库存统计
  useEffect(() => {
    const loadInventoryStats = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        if (data.success) {
          // 按产品ID分组统计
          const stats: Record<string, any> = {};
          data.data.forEach((inv: any) => {
            if (!stats[inv.productId]) {
              stats[inv.productId] = { AVAILABLE: 0, RESERVED: 0, SOLD: 0, EXPIRED: 0, total: 0 };
            }
            stats[inv.productId][inv.status] = (stats[inv.productId][inv.status] || 0) + 1;
            stats[inv.productId].total += 1;
          });
          setInventoryStats(stats);
        }
      } catch (error) {
        console.error('加载库存统计失败:', error);
      }
    };
    loadInventoryStats();
  }, []);

  // 查看产品库存
  const handleViewInventory = async (product: any) => {
    setSelectedProduct(product);
    try {
      const response = await fetch(`/api/inventory?productId=${product.id}`);
      const data = await response.json();
      if (data.success) {
        setInventoryData(data.data);
        setViewModalVisible(true);
      } else {
        message.error('加载库存失败');
      }
    } catch (error) {
      message.error('加载库存失败');
    }
  };

  // 打开导入模态框
  const handleOpenImport = (product: any) => {
    setSelectedProduct(product);
    setImportText('');
    setImportModalVisible(true);
  };

  // 打开提卡模态框
  const handleOpenExtract = (product: any) => {
    setSelectedProduct(product);
    setExtractQuantity(1);
    setExtractEmail('');
    setExtractNote('');
    setExtractedCards([]);
    setExtractModalVisible(true);
  };

  // 管理员提卡
  const handleExtractCards = async () => {
    if (extractQuantity < 1) {
      message.error('提卡数量必须大于0');
      return;
    }

    setExtracting(true);
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}/extract-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: extractQuantity,
          buyerEmail: extractEmail || undefined,
          note: extractNote || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message.success(`成功提取 ${data.data.quantity} 个卡密`);
        setExtractedCards(data.data.cards);

        // 重新加载库存统计
        const statsResponse = await fetch('/api/inventory');
        const statsData = await statsResponse.json();
        if (statsData.success) {
          const stats: Record<string, any> = {};
          statsData.data.forEach((inv: any) => {
            if (!stats[inv.productId]) {
              stats[inv.productId] = { AVAILABLE: 0, RESERVED: 0, SOLD: 0, EXPIRED: 0, total: 0 };
            }
            stats[inv.productId][inv.status] = (stats[inv.productId][inv.status] || 0) + 1;
            stats[inv.productId].total += 1;
          });
          setInventoryStats(stats);
        }
      } else {
        message.error(data.error || '提卡失败');
      }
    } catch (error) {
      message.error('提卡失败');
    } finally {
      setExtracting(false);
    }
  };

  // 批量导入库存
  const handleImport = async () => {
    if (!importText.trim()) {
      message.error('请输入库存数据');
      return;
    }

    setImporting(true);
    try {
      // 解析输入数据（每行一个纯文本卡密）
      const lines = importText.trim().split('\n');
      const items: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) {
          items.push(trimmed);
        }
      });

      if (items.length === 0) {
        message.error('没有有效的库存数据');
        setImporting(false);
        return;
      }

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          items,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message.success(`成功导入 ${data.data.count} 条库存记录`);
        setImportModalVisible(false);
        setImportText('');
        // 重新加载库存统计
        const statsResponse = await fetch('/api/inventory');
        const statsData = await statsResponse.json();
        if (statsData.success) {
          const stats: Record<string, any> = {};
          statsData.data.forEach((inv: any) => {
            if (!stats[inv.productId]) {
              stats[inv.productId] = { AVAILABLE: 0, RESERVED: 0, SOLD: 0, EXPIRED: 0, total: 0 };
            }
            stats[inv.productId][inv.status] = (stats[inv.productId][inv.status] || 0) + 1;
            stats[inv.productId].total += 1;
          });
          setInventoryStats(stats);
        }
      } else {
        message.error(data.error || '导入失败');
      }
    } catch (error) {
      message.error('导入失败');
    } finally {
      setImporting(false);
    }
  };

  // CSV文件上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv,.txt',
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setImportText(text);
      };
      reader.readAsText(file);
      return false; // 阻止自动上传
    },
  };

  const columns = [
    {
      title: '产品',
      key: 'product',
      width: 300,
      render: (_: any, record: any) => (
        <div className="product-cell">
          <Image
            src={record.image || '/placeholder.png'}
            alt={record.name}
            width={56}
            height={56}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23f0f0f0' width='56' height='56'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999'%3E📦%3C/text%3E%3C/svg%3E"
          />
          <div className="product-info">
            <div className="product-name">{record.name}</div>
            <div className="product-slug">{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categories',
      key: 'categories',
      width: 120,
      render: (category: any) => (
        <Tag className="category-tag">
          {category?.icon} {category?.name || '-'}
        </Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price: number, record: any) => (
        <div className="price-cell">
          <div className="current-price">
            ¥{parseFloat(price.toString()).toFixed(2)}
          </div>
          {record.originalPrice && (
            <div className="original-price">
              ¥{parseFloat(record.originalPrice.toString()).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string; className: string }> = {
          DRAFT: { color: 'default', text: '草稿', className: 'status-draft' },
          ACTIVE: { color: 'success', text: '上架', className: 'status-active' },
          INACTIVE: { color: 'warning', text: '下架', className: 'status-inactive' },
          SOLD_OUT: { color: 'error', text: '售罄', className: 'status-soldout' },
        };
        const config = statusConfig[status] || { color: 'default', text: status, className: '' };
        return <Tag className={`status-tag ${config.className}`}>{config.text}</Tag>;
      },
    },
    {
      title: '库存',
      key: 'inventory',
      width: 180,
      render: (_: any, record: any) => {
        const stats = inventoryStats[record.id] || { AVAILABLE: 0, total: 0 };
        const isLowStock = stats.AVAILABLE < 10;
        return (
          <div className="inventory-cell-new">
            <div className="inventory-badge-row">
              <Badge
                count={stats.AVAILABLE}
                showZero
                className={isLowStock ? 'badge-low' : 'badge-ok'}
                overflowCount={9999}
              />
              <span className="inventory-label">可用</span>
            </div>
            <Space size={4} className="inventory-actions-new">
              <Tooltip title="查看库存详情">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewInventory(record)}
                  className="action-icon-btn"
                />
              </Tooltip>
              <Tooltip title="导入库存">
                <Button
                  type="text"
                  size="small"
                  icon={<UploadOutlined />}
                  onClick={() => handleOpenImport(record)}
                  className="action-icon-btn"
                />
              </Tooltip>
              <Tooltip title="管理员提卡">
                <Button
                  type="text"
                  size="small"
                  icon={<DatabaseOutlined />}
                  onClick={() => handleOpenExtract(record)}
                  className="action-icon-btn extract-btn"
                />
              </Tooltip>
            </Space>
          </div>
        );
      },
    },
    {
      title: '数据',
      key: 'stats',
      width: 180,
      render: (_: any, record: any) => (
        <div className="stats-cell">
          <div className="stat-item">
            <ShoppingOutlined className="stat-icon" />
            <span>{record.salesCount || 0}</span>
          </div>
          <div className="stat-item">
            <EyeOutlined className="stat-icon" />
            <span>{record.viewCount || 0}</span>
          </div>
          {record.featured && (
            <Tag className="featured-tag">⭐ 推荐</Tag>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space className="action-buttons">
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <div className="products-page">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" variant="outlined">
            <Statistic
              title="产品总数"
              value={tableProps?.dataSource?.length || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" variant="outlined">
            <Statistic
              title="上架中"
              value={tableProps?.dataSource?.filter((p: any) => p.status === 'ACTIVE').length || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" variant="outlined">
            <Statistic
              title="总销量"
              value={tableProps?.dataSource?.reduce((sum: number, p: any) => sum + (p.salesCount || 0), 0) || 0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card" variant="outlined">
            <Statistic
              title="总浏览量"
              value={tableProps?.dataSource?.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0) || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 产品列表 */}
      <List
        headerButtons={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="create-button"
            onClick={() => router.push('/products/create')}
          >
            添加产品
          </Button>
        }
      >
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          className="products-table"
          pagination={{
            ...tableProps?.pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个产品`,
          }}
        />
      </List>

      {/* 导入库存模态框 */}
      <Modal
        title={`批量导入库存 - ${selectedProduct?.name}`}
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={handleImport}
        confirmLoading={importing}
        width={700}
      >
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px', color: '#666' }}>
            请输入卡密数据，<strong>每行一个卡密</strong>
          </p>
          <p style={{ marginBottom: '16px', fontSize: '12px', color: '#999' }}>
            示例：<br />
            <code>ABC123DEF456GHI789</code><br />
            <code>XYZ999AAA111BBB222</code><br />
            <code>CARD-2024-0001-ABCD</code>
          </p>
          <Dragger {...uploadProps} style={{ marginBottom: '16px' }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传TXT文件</p>
            <p className="ant-upload-hint">支持 .txt 格式，每行一个卡密</p>
          </Dragger>
          <TextArea
            rows={10}
            placeholder="或直接粘贴卡密到这里，每行一个&#10;ABC123DEF456GHI789&#10;XYZ999AAA111BBB222&#10;CARD-2024-0001-ABCD"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />
        </div>
      </Modal>

      {/* 查看库存模态框 */}
      <Modal
        title={`库存详情 - ${selectedProduct?.name}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          dataSource={inventoryData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
          columns={[
            {
              title: '卡密',
              dataIndex: 'cardNumber',
              key: 'cardNumber',
              width: 300,
              render: (text) => (
                <code style={{
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  background: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  {text || '-'}
                </code>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (status) => {
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
              title: '批次号',
              dataIndex: 'batchId',
              key: 'batchId',
              width: 200,
              render: (text) => text ? <code style={{ fontSize: '11px' }}>{text.substring(0, 20)}...</code> : '-',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              width: 180,
              render: (date) => new Date(date).toLocaleString('zh-CN'),
            },
          ]}
        />
      </Modal>

      {/* 提卡模态框 */}
      <Modal
        title={`管理员提卡 - ${selectedProduct?.name}`}
        open={extractModalVisible}
        onCancel={() => {
          setExtractModalVisible(false);
          setExtractedCards([]);
        }}
        onOk={() => {
          if (extractedCards.length > 0) {
            // 已经提卡成功，点击关闭
            setExtractModalVisible(false);
            setExtractedCards([]);
          } else {
            // 执行提卡操作
            handleExtractCards();
          }
        }}
        confirmLoading={extracting}
        okText={extractedCards.length > 0 ? '关闭' : '确认提卡'}
        cancelButtonProps={{ style: { display: extractedCards.length > 0 ? 'none' : 'inline-block' } }}
      >
        {extractedCards.length === 0 ? (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ marginBottom: '16px', color: '#666' }}>
              当前可用库存: <strong style={{ color: '#52c41a', fontSize: '16px' }}>
                {inventoryStats[selectedProduct?.id]?.AVAILABLE || 0}
              </strong> 个
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                提卡数量 <span style={{ color: '#f5222d' }}>*</span>
              </label>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={inventoryStats[selectedProduct?.id]?.AVAILABLE || 1}
                value={extractQuantity}
                onChange={(val) => setExtractQuantity(val || 1)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                买家邮箱（可选）
              </label>
              <Input
                placeholder="例如: customer@example.com"
                value={extractEmail}
                onChange={(e) => setExtractEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                备注说明（可选）
              </label>
              <TextArea
                rows={3}
                placeholder="提卡原因或其他备注信息..."
                value={extractNote}
                onChange={(e) => setExtractNote(e.target.value)}
              />
            </div>

            <div style={{
              background: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '12px',
              color: '#ad6800'
            }}>
              <strong>提示：</strong>提卡后将自动生成订单并扣减库存，订单状态为"已发货"。
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: 0, color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                ✓ 成功提取 {extractedCards.length} 个卡密
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>提取的卡密：</p>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    const cards = extractedCards.map(card => card.cardNumber).join('\n');
                    navigator.clipboard.writeText(cards);
                    message.success('卡密已复制到剪贴板');
                  }}
                >
                  一键复制全部
                </Button>
              </div>
              <TextArea
                rows={Math.min(extractedCards.length, 15)}
                value={extractedCards.map(card => card.cardNumber).join('\n')}
                readOnly
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  background: '#fafafa',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '12px',
              color: '#0050b3'
            }}>
              <strong>提示：</strong>卡密每行一条，可直接选中复制或点击上方"一键复制全部"按钮。关闭后可在订单详情中查看。
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
