const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Haishi@1688@127.0.0.1:5432/blueunion',
    },
  },
});

async function resetAdminPassword() {
  try {
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('🔄 重置管理员密码为: admin123\n');

    const updated = await prisma.users.update({
      where: { username: 'admin' },
      data: { password: hashedPassword },
    });

    console.log('✅ 密码重置成功！');
    console.log('用户名:', updated.username);
    console.log('新密码哈希:', hashedPassword.substring(0, 30) + '...');

    // 验证新密码
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('\n🔐 验证新密码:', isValid ? '✅ 正确' : '❌ 错误');

    console.log('\n✨ 现在可以使用以下凭证登录：');
    console.log('   用户名: admin');
    console.log('   密码: admin123');

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
