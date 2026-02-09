# 蓝聚出海 (BlueUnion)

专注于全球数字营销与出海增长解决方案的官网、发卡平台和管理系统。

## 📦 项目结构

这是一个基于 pnpm workspace 的 Monorepo 项目，包含三个主要应用：

```
BlueUnion/
├── apps/
│   ├── website/      # 官网 + 发卡平台 (Next.js)
│   ├── admin/        # 管理后台 (Refine.dev)
│   └── api/          # 后端API (Nest.js)
└── packages/
    └── shared-types/ # 共享TypeScript类型
```

## 🛠️ 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **后端**: Nest.js, TypeORM, PostgreSQL
- **管理后台**: Refine.dev, Ant Design
- **包管理**: pnpm
- **国际化**: next-intl (官网中英文)

## 🚀 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动所有服务
pnpm dev

# 或单独启动
pnpm dev:website   # 官网 (http://localhost:3000)
pnpm dev:admin     # 管理后台 (http://localhost:3002)
pnpm dev:api       # 后端API (http://localhost:3001)
```

### 构建

```bash
# 构建所有项目
pnpm build

# 或单独构建
pnpm build:website
pnpm build:admin
pnpm build:api
```

## 📝 环境变量

复制 `.env.example` 到 `.env` 并修改相应配置：

```bash
cp .env.example .env
```

## 🗂️ 应用说明

### 官网 (apps/website)

- 支持中英文双语
- 企业介绍、服务领域展示
- 发卡平台（虚拟商品购买）

### 管理后台 (apps/admin)

- 基于 Refine.dev
- 商品管理（CRUD）
- 库存管理（批量导入）
- 订单管理（查看、搜索）

### 后端API (apps/api)

- RESTful API
- JWT 认证
- PostgreSQL 数据库
- 事务处理（防止库存超卖）

## 📖 开发文档

详细的开发计划请查看：`/Users/yy/.claude/plans/playful-fluttering-dove.md`

## 🔒 安全

- 密码使用 bcrypt 加密
- JWT token 认证
- CORS 保护
- 输入验证

## 📄 License

MIT
