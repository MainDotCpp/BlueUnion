import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据初始化...');

  // 1. 创建权限
  console.log('📝 创建权限...');
  const permissions = await Promise.all([
    // 商品权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'product', action: 'create' } },
      update: {},
      create: { resource: 'product', action: 'create', description: '创建商品' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'product', action: 'read' } },
      update: {},
      create: { resource: 'product', action: 'read', description: '查看商品' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'product', action: 'update' } },
      update: {},
      create: { resource: 'product', action: 'update', description: '更新商品' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'product', action: 'delete' } },
      update: {},
      create: { resource: 'product', action: 'delete', description: '删除商品' },
    }),

    // 分类权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'category', action: 'create' } },
      update: {},
      create: { resource: 'category', action: 'create', description: '创建分类' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'category', action: 'read' } },
      update: {},
      create: { resource: 'category', action: 'read', description: '查看分类' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'category', action: 'update' } },
      update: {},
      create: { resource: 'category', action: 'update', description: '更新分类' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'category', action: 'delete' } },
      update: {},
      create: { resource: 'category', action: 'delete', description: '删除分类' },
    }),

    // 库存权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'create' } },
      update: {},
      create: { resource: 'inventory', action: 'create', description: '创建库存' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'read' } },
      update: {},
      create: { resource: 'inventory', action: 'read', description: '查看库存' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'update' } },
      update: {},
      create: { resource: 'inventory', action: 'update', description: '更新库存' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'delete' } },
      update: {},
      create: { resource: 'inventory', action: 'delete', description: '删除库存' },
    }),

    // 订单权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'order', action: 'read' } },
      update: {},
      create: { resource: 'order', action: 'read', description: '查看订单' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'order', action: 'update' } },
      update: {},
      create: { resource: 'order', action: 'update', description: '更新订单' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'order', action: 'refund' } },
      update: {},
      create: { resource: 'order', action: 'refund', description: '处理退款' },
    }),

    // 用户权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'create' } },
      update: {},
      create: { resource: 'user', action: 'create', description: '创建用户' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'read' } },
      update: {},
      create: { resource: 'user', action: 'read', description: '查看用户' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'update' } },
      update: {},
      create: { resource: 'user', action: 'update', description: '更新用户' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'delete' } },
      update: {},
      create: { resource: 'user', action: 'delete', description: '删除用户' },
    }),

    // 角色权限
    prisma.permission.upsert({
      where: { resource_action: { resource: 'role', action: 'create' } },
      update: {},
      create: { resource: 'role', action: 'create', description: '创建角色' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'role', action: 'read' } },
      update: {},
      create: { resource: 'role', action: 'read', description: '查看角色' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'role', action: 'update' } },
      update: {},
      create: { resource: 'role', action: 'update', description: '更新角色' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'role', action: 'delete' } },
      update: {},
      create: { resource: 'role', action: 'delete', description: '删除角色' },
    }),
  ]);

  console.log(`✅ 创建了 ${permissions.length} 个权限`);

  // 2. 创建超级管理员角色
  console.log('👑 创建超级管理员角色...');
  const superAdminRole = await prisma.role.upsert({
    where: { code: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '拥有所有权限',
      permissions: {
        connect: permissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // 3. 创建默认管理员账号
  console.log('👤 创建默认管理员账号...');
  const defaultUsername = process.env.ADMIN_DEFAULT_USERNAME || 'admin';
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { username: defaultUsername },
    update: {},
    create: {
      username: defaultUsername,
      password: hashedPassword,
      nickname: '系统管理员',
      email: 'admin@blueunion.com',
      status: 'ACTIVE',
      roleId: superAdminRole.id,
    },
  });

  console.log(`✅ 创建管理员账号: ${adminUser.username}`);

  // 4. 创建示例分类
  console.log('📁 创建示例分类...');
  const category1 = await prisma.category.upsert({
    where: { slug: 'digital-products' },
    update: {},
    create: {
      name: '数字产品',
      slug: 'digital-products',
      description: '各类数字产品',
      status: 'ACTIVE',
      sort: 1,
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'game-cards' },
    update: {},
    create: {
      name: '游戏点卡',
      slug: 'game-cards',
      description: '各类游戏充值卡',
      status: 'ACTIVE',
      sort: 2,
    },
  });

  console.log(`✅ 创建了 2 个示例分类`);

  console.log('');
  console.log('🎉 种子数据初始化完成！');
  console.log('');
  console.log('📋 默认管理员账号信息：');
  console.log(`   用户名: ${defaultUsername}`);
  console.log(`   密码: ${defaultPassword}`);
  console.log('');
  console.log('⚠️  请在生产环境中修改默认密码！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
