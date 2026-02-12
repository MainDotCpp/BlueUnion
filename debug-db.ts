import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://blueunion:blueunion@141.164.43.115:5432/blueunion',
    },
  },
});

async function main() {
  try {
    console.log('Connecting to database...');
    const count = await prisma.products.count();
    console.log(`Product count: ${count}`);

    const products = await prisma.products.findMany({
      take: 2,
      select: { id: true, name: true, price: true },
    });
    console.log('Sample products:', JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
