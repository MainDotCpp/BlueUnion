const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Haishi@1688@127.0.0.1:5432/blueunion',
    },
  },
});

async function seedCategories() {
  try {
    console.log('🌱 开始创建初始分类数据...\n');

    const categories = [
      {
        id: 'cat_game_recharge',
        name: '游戏充值',
        slug: 'game-recharge',
        description: '各类游戏充值卡、点券',
        icon: '🎮',
        sort: 1,
        status: 'ACTIVE',
      },
      {
        id: 'cat_membership',
        name: '会员订阅',
        slug: 'membership',
        description: 'Netflix、YouTube、Spotify等会员服务',
        icon: '👑',
        sort: 2,
        status: 'ACTIVE',
      },
      {
        id: 'cat_software',
        name: '软件激活码',
        slug: 'software',
        description: 'Office、Adobe、ChatGPT等软件激活码',
        icon: '💻',
        sort: 3,
        status: 'ACTIVE',
      },
      {
        id: 'cat_gift_card',
        name: '礼品卡',
        slug: 'gift-card',
        description: 'Apple、Google Play、Amazon等礼品卡',
        icon: '🎁',
        sort: 4,
        status: 'ACTIVE',
      },
      {
        id: 'cat_vpn',
        name: 'VPN加速器',
        slug: 'vpn',
        description: '各类VPN服务订阅',
        icon: '🚀',
        sort: 5,
        status: 'ACTIVE',
      },
    ];

    for (const category of categories) {
      const existing = await prisma.categories.findUnique({
        where: { id: category.id },
      });

      if (existing) {
        console.log(`⏭️  分类已存在: ${category.name}`);
        continue;
      }

      await prisma.categories.create({
        data: {
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`✅ 创建分类: ${category.name}`);
    }

    console.log('\n🎉 初始分类数据创建完成！');
    console.log('\n📋 已创建的分类：');

    const allCategories = await prisma.categories.findMany({
      orderBy: { sort: 'asc' },
    });

    allCategories.forEach((cat) => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.id})`);
    });

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
