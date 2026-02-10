const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Haishi@1688@127.0.0.1:5432/blueunion',
    },
  },
});

async function checkAdmin() {
  try {
    console.log('🔍 查询管理员账号...\n');

    const user = await prisma.users.findUnique({
      where: { username: 'admin' },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      console.log('❌ 未找到 admin 用户！');
      console.log('\n请运行以下 SQL 创建管理员账号：');
      console.log(`
-- 1. 创建管理员角色
INSERT INTO roles (id, name, code, description, "createdAt", "updatedAt")
VALUES ('role-admin-001', 'Super Admin', 'SUPER_ADMIN', 'System administrator with full access', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 2. 创建管理员用户
INSERT INTO users (id, username, email, password, nickname, status, "roleId", "createdAt", "updatedAt")
VALUES (
  'user-admin-001',
  'admin',
  'admin@blueunion.com',
  '${await bcrypt.hash('admin123', 10)}',
  'Administrator',
  'ACTIVE',
  'role-admin-001',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;
      `);
      return;
    }

    console.log('✅ 找到管理员账号：');
    console.log('用户名:', user.username);
    console.log('邮箱:', user.email);
    console.log('昵称:', user.nickname);
    console.log('状态:', user.status);
    console.log('角色ID:', user.roleId);
    console.log('角色名:', user.roles?.name);
    console.log('密码哈希:', user.password.substring(0, 30) + '...');

    console.log('\n🔐 测试密码验证...');
    const testPasswords = ['admin123', 'admin', '123456'];

    for (const pwd of testPasswords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      console.log(`密码 "${pwd}":`, isValid ? '✅ 正确' : '❌ 错误');
    }

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
