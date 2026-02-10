const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 开始初始化管理员账号...\n');

  try {
    // 1. 创建超级管理员角色
    const role = await prisma.role.upsert({
      where: { code: 'SUPER_ADMIN' },
      update: {},
      create: {
        name: '超级管理员',
        code: 'SUPER_ADMIN',
        description: '拥有所有权限',
      },
    });

    console.log('✅ 角色创建成功:', role.name);

    // 2. 创建默认管理员账号
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
        nickname: '系统管理员',
        email: 'admin@blueunion.com',
        status: 'ACTIVE',
        roleId: role.id,
      },
    });

    console.log('✅ 管理员账号创建成功:', admin.username);
    console.log('\n📋 登录信息：');
    console.log('   用户名: admin');
    console.log('   密码: admin123');
    console.log('   访问地址: http://localhost:3002/login\n');
    console.log('🎉 初始化完成！现在可以启动开发服务器了！\n');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
